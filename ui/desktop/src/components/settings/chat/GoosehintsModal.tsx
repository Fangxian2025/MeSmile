import { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Check } from '../../icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { errorMessage } from '../../../utils/conversionUtils';
import { defineMessages, useIntl } from '../../../i18n';

const i18n = defineMessages({
  dialogTitle: {
    id: 'mesmilehintsModal.dialogTitle',
    defaultMessage: 'Configure Project Hints (.mesmilehints)',
  },
  dialogDescription: {
    id: 'mesmilehintsModal.dialogDescription',
    defaultMessage:
      'Provide additional context about your project to improve communication with Goose',
  },
  helpText1: {
    id: 'mesmilehintsModal.helpText1',
    defaultMessage:
      '.mesmilehints is a text file used to provide additional context about your project and improve the communication with Goose.',
  },
  helpText2: {
    id: 'mesmilehintsModal.helpText2',
    defaultMessage:
      "Please make sure {bold} extension is enabled in the extensions page. This extension is required to use .mesmilehints. You'll need to restart your session for .mesmilehints updates to take effect.",
  },
  helpText3: {
    id: 'mesmilehintsModal.helpText3',
    defaultMessage: 'See {link} for more information.',
  },
  helpTextLink: {
    id: 'mesmilehintsModal.helpTextLink',
    defaultMessage: 'using .mesmilehints',
  },
  errorReading: {
    id: 'mesmilehintsModal.errorReading',
    defaultMessage: 'Error reading .mesmilehints file: {error}',
  },
  fileFound: {
    id: 'mesmilehintsModal.fileFound',
    defaultMessage: '.mesmilehints file found at: {filePath}',
  },
  fileCreating: {
    id: 'mesmilehintsModal.fileCreating',
    defaultMessage: 'Creating new .mesmilehints file at: {filePath}',
  },
  placeholder: {
    id: 'mesmilehintsModal.placeholder',
    defaultMessage: 'Enter project hints here...',
  },
  savedSuccessfully: {
    id: 'mesmilehintsModal.savedSuccessfully',
    defaultMessage: 'Saved successfully',
  },
  close: {
    id: 'mesmilehintsModal.close',
    defaultMessage: 'Close',
  },
  saving: {
    id: 'mesmilehintsModal.saving',
    defaultMessage: 'Saving...',
  },
  save: {
    id: 'mesmilehintsModal.save',
    defaultMessage: 'Save',
  },
  failedToAccess: {
    id: 'mesmilehintsModal.failedToAccess',
    defaultMessage: 'Failed to access .mesmilehints file',
  },
  failedToSave: {
    id: 'mesmilehintsModal.failedToSave',
    defaultMessage: 'Failed to save .mesmilehints file',
  },
  developer: {
    id: 'mesmilehintsModal.developer',
    defaultMessage: 'Developer',
  },
});

const HelpText = () => {
  const intl = useIntl();

  return (
    <div className="text-sm flex-col space-y-4 text-text-secondary">
      <p>{intl.formatMessage(i18n.helpText1)}</p>
      <p>
        {intl.formatMessage(i18n.helpText2, {
          bold: <span className="font-bold">{intl.formatMessage(i18n.developer)}</span>,
        })}
      </p>
      <p>
        {intl.formatMessage(i18n.helpText3, {
          link: (
            <Button
              variant="link"
              className="text-blue-500 hover:text-blue-600 p-0 h-auto"
              onClick={() =>
                window.open(
                  'https://mesmile-docs.ai/docs/guides/using-mesmilehints/',
                  '_blank'
                )
              }
            >
              {intl.formatMessage(i18n.helpTextLink)}
            </Button>
          ),
        })}
      </p>
    </div>
  );
};

const ErrorDisplay = ({ error }: { error: Error }) => {
  const intl = useIntl();

  return (
    <div className="text-sm text-text-secondary">
      <div className="text-red-600">
        {intl.formatMessage(i18n.errorReading, { error: errorMessage(error) })}
      </div>
    </div>
  );
};

const FileInfo = ({ filePath, found }: { filePath: string; found: boolean }) => {
  const intl = useIntl();

  return (
    <div className="text-sm font-medium mb-2">
      {found ? (
        <div className="text-green-600">
          <Check className="w-4 h-4 inline-block" />{' '}
          {intl.formatMessage(i18n.fileFound, { filePath })}
        </div>
      ) : (
        <div>{intl.formatMessage(i18n.fileCreating, { filePath })}</div>
      )}
    </div>
  );
};

const getMesmilehintsFile = async (filePath: string) => await window.electron.readFile(filePath);

interface MesmilehintsModalProps {
  directory: string;
  setIsMesmilehintsModalOpen: (isOpen: boolean) => void;
}

export const MesmilehintsModal = ({ directory, setIsMesmilehintsModalOpen }: MesmilehintsModalProps) => {
  const intl = useIntl();
  const mesmilehintsFilePath = `${directory}/.mesmilehints`;
  const [mesmilehintsFile, setMesmilehintsFile] = useState<string>('');
  const [mesmilehintsFileFound, setMesmilehintsFileFound] = useState<boolean>(false);
  const [mesmilehintsFileReadError, setMesmilehintsFileReadError] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchMesmilehintsFile = async () => {
      try {
        const { file, error, found } = await getMesmilehintsFile(mesmilehintsFilePath);
        setMesmilehintsFile(file);
        setMesmilehintsFileFound(found);
        setMesmilehintsFileReadError(found && error ? error : '');
      } catch (error) {
        console.error('Error fetching .mesmilehints file:', error);
        setMesmilehintsFileReadError(intl.formatMessage(i18n.failedToAccess));
      }
    };
    if (directory) fetchMesmilehintsFile();
  }, [directory, mesmilehintsFilePath, intl]);

  const writeFile = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await window.electron.writeFile(mesmilehintsFilePath, mesmilehintsFile);
      setSaveSuccess(true);
      setMesmilehintsFileFound(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error writing .mesmilehints file:', error);
      setMesmilehintsFileReadError(intl.formatMessage(i18n.failedToSave));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => setIsMesmilehintsModalOpen(open)}>
      <DialogContent className="w-[80vw] max-w-[80vw] sm:max-w-[80vw] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{intl.formatMessage(i18n.dialogTitle)}</DialogTitle>
          <DialogDescription>{intl.formatMessage(i18n.dialogDescription)}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pt-2 pb-4">
          <HelpText />

          <div>
            {mesmilehintsFileReadError ? (
              <ErrorDisplay error={new Error(mesmilehintsFileReadError)} />
            ) : (
              <div className="space-y-2">
                <FileInfo filePath={mesmilehintsFilePath} found={mesmilehintsFileFound} />
                <textarea
                  value={mesmilehintsFile}
                  className="w-full h-80 border rounded-md p-2 text-sm resize-none bg-background-primary text-text-primary border-border-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(event) => setMesmilehintsFile(event.target.value)}
                  placeholder={intl.formatMessage(i18n.placeholder)}
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          {saveSuccess && (
            <span className="text-green-600 text-sm flex items-center gap-1 mr-auto">
              <Check className="w-4 h-4" />
              {intl.formatMessage(i18n.savedSuccessfully)}
            </span>
          )}
          <Button variant="outline" onClick={() => setIsMesmilehintsModalOpen(false)}>
            {intl.formatMessage(i18n.close)}
          </Button>
          <Button onClick={writeFile} disabled={isSaving}>
            {isSaving ? intl.formatMessage(i18n.saving) : intl.formatMessage(i18n.save)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
