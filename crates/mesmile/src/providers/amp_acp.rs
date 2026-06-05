use anyhow::Result;
use futures::future::BoxFuture;
use std::collections::HashMap;
use std::path::PathBuf;

use crate::acp::{
    extension_configs_to_mcp_servers, AcpProvider, AcpProviderConfig, ACP_CURRENT_MODEL,
};
use crate::config::search_path::SearchPaths;
use crate::config::{Config, MeSmileMode};
use crate::model::ModelConfig;
use crate::providers::acp_tooling::{acp_adapter_installed, acp_inventory_identity};
use crate::providers::base::{current_working_dir, ProviderDef, ProviderMetadata};
use crate::providers::inventory::InventoryIdentityInput;

const AMP_ACP_PROVIDER_NAME: &str = "amp-acp";
const AMP_ACP_DOC_URL: &str = "https://ampcode.com";
const AMP_ACP_BINARY: &str = "amp-acp";

pub struct AmpAcpProvider;

impl ProviderDef for AmpAcpProvider {
    type Provider = AcpProvider;

    fn metadata() -> ProviderMetadata {
        ProviderMetadata::new(
            AMP_ACP_PROVIDER_NAME,
            "Amp",
            "Use goose with your Amp subscription via the amp-acp adapter.",
            ACP_CURRENT_MODEL,
            vec![],
            AMP_ACP_DOC_URL,
            vec![],
        )
        .with_setup_steps(vec![
            "Install the Amp CLI: `curl -fsSL https://ampcode.com/install.sh | bash`",
            "Install the ACP adapter: `npm install -g amp-acp`",
            "Ensure your Amp CLI is authenticated (run `amp` to verify)",
            "Add to your MeSmile config file (`~/.config/mesmile/config.yaml` on macOS/Linux):\n  GOOSE_PROVIDER: amp-acp\n  GOOSE_MODEL: current\n  amp-acp_configured: true",
            "Restart goose for changes to take effect",
        ])
        .with_model_selection_hint("Use the Amp CLI to configure models")
    }

    fn from_env(
        model: ModelConfig,
        extensions: Vec<crate::config::ExtensionConfig>,
    ) -> BoxFuture<'static, Result<AcpProvider>> {
        Self::from_env_with_working_dir(model, extensions, current_working_dir())
    }

    fn from_env_with_working_dir(
        model: ModelConfig,
        extensions: Vec<crate::config::ExtensionConfig>,
        working_dir: PathBuf,
    ) -> BoxFuture<'static, Result<AcpProvider>> {
        Box::pin(async move {
            let config = Config::global();
            let resolved_command = SearchPaths::builder().with_npm().resolve(AMP_ACP_BINARY)?;
            let mesmile_mode = config.get_mesmile_model().unwrap_or(MeSmileMode::Auto);

            let mode_mapping = HashMap::from([
                // "bypass" skips confirmations, closest to autonomous mode.
                (MeSmileMode::Auto, "bypass".to_string()),
                // "default" prompts before risky actions.
                (MeSmileMode::Approve, "default".to_string()),
                (MeSmileMode::SmartApprove, "default".to_string()),
                (MeSmileMode::Chat, "default".to_string()),
            ]);

            let provider_config = AcpProviderConfig {
                command: resolved_command,
                args: vec![],
                env: vec![],
                env_remove: vec![],
                work_dir: working_dir,
                mcp_servers: extension_configs_to_mcp_servers(&extensions),
                session_mode_id: Some(mode_mapping[&mesmile_mode].clone()),
                mode_mapping,
                notification_callback: None,
            };

            let metadata = Self::metadata();
            AcpProvider::connect(metadata.name, model, mesmile_mode, provider_config).await
        })
    }

    fn supports_inventory_refresh() -> bool {
        false
    }

    fn inventory_identity() -> Result<InventoryIdentityInput> {
        acp_inventory_identity(AMP_ACP_PROVIDER_NAME, AMP_ACP_BINARY)
    }

    fn inventory_configured() -> bool {
        acp_adapter_installed(AMP_ACP_BINARY)
    }
}
