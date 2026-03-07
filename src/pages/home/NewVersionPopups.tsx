import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CURRENT_VERSION = "1.1";

const NewVersionPopups = () => {
  const [showReleaseDialog, setShowReleaseDialog] = useState(false);

  useEffect(() => {
    const storedVersion = localStorage.getItem("version");

    if (!storedVersion || storedVersion !== CURRENT_VERSION) {
      toast("New version released", {
        description: `Version: ${CURRENT_VERSION}`,
        action: (
          <Button onClick={() => setShowReleaseDialog(true)}>
            More Info
          </Button>
        ),
      });
    }
    localStorage.setItem("version", CURRENT_VERSION);
  }, []);

  return (
    <CurrentReleaseDialog
      open={showReleaseDialog}
      setOpen={setShowReleaseDialog}
      newVersion={CURRENT_VERSION}
    />
  );
};

const CurrentReleaseDialog = ({
  newVersion,
  open,
  setOpen,
}: {
  newVersion: string;
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const handleContinue = () => {
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader className="space-y-4">
          <AlertDialogTitle className="text-2xl font-semibold">
            Welcome to LessonGear
          </AlertDialogTitle>

          <AlertDialogDescription className="flex flex-col text-md leading-relaxed text-muted-foreground space-y-2">
            <span>
              Version
              <span className="font-medium text-foreground">
                {" "} {newVersion} {" "}
              </span>
            </span>

            <span>
              In this version we are introducing functionality to delete classes and edit their names.
            </span>

            <span className="pt-2 block">
              We hope you enjoy using LessonGear.
              <br />
              <span className="font-medium text-foreground">
                — Your LessonGear Dev Team
              </span>
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction onClick={handleContinue}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NewVersionPopups;