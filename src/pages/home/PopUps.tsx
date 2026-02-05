import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useEffect, useState } from "react";

export const WelcomeInfoDialog = () => {
    const [open, setOpen] = useState(false);
    
    useEffect(() => {
        const hasSeen = localStorage.getItem("hasSeenWelcomePopup");
        if (hasSeen !== "true") {
            setOpen(true);
        }
    }, []);

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            localStorage.setItem("hasSeenWelcomePopup", "true");
        }
        setOpen(isOpen);
    };
    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader className="space-y-4">
                    <AlertDialogTitle className="text-2xl font-semibold">
                        Welcome to LessonGear
                    </AlertDialogTitle>

                    <AlertDialogDescription className="flex flex-col text-md leading-relaxed text-muted-foreground space-y-2">
                        <span>
                            We’re excited to introduce a new version of LessonGear featuring a
                        <span className="font-medium text-foreground">
                            {" "}completely reworked design{" "}
                        </span>
                            and several powerful new tools.
                        </span>
                        <span>
                            <span className="font-medium text-foreground">Class Management</span> has
                            never been easier. You can now create and manage classes that are safely
                            stored in local storage — simply select the class you need in any tool.
                        </span>
                        <span>
                            We’ve also refreshed the design of
                        <span className="font-medium text-foreground"> SeatMatch</span> and
                        <span className="font-medium text-foreground"> GroupGenerator </span>
                            for a cleaner and more intuitive experience.
                        </span>
                        <span>
                            Additionally we have also added language support for
                        <span className="font-medium text-foreground"> German, French and Spanish</span>. 
                            (Translations by AI, mistakes possible) Choose your preferred language now!
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
                    <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}



export const WhatsNewGroupGen = () => {
    const [open, setOpen] = useState(false);
    
    useEffect(() => {
        const hasSeen = localStorage.getItem("hasSeenWhatsNewGroupGen");
        if (hasSeen !== "true") {
            setOpen(true);
        }
    }, []);

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            localStorage.setItem("hasSeenWhatsNewGroupGen", "true");
        }
        setOpen(isOpen);
    };
    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader className="space-y-4">
                    <AlertDialogTitle className="text-2xl font-semibold">
                        What's new in GroupGenerator
                    </AlertDialogTitle>

                    <AlertDialogDescription className="flex flex-col text-md leading-relaxed text-muted-foreground space-y-2">
                        <span>
                            In this version we have brought new features to
                            <span className="font-medium text-foreground">
                                {" "}GroupGenerator{" "}
                            </span>
                        </span>

                        <span>
                            Decide on a 
                            <span className="font-medium text-foreground">
                                {" "}mode{" "}
                            </span> 
                            (either number of groups or number of people per groups) by changing the toggle
                        </span>

                        <span>
                            Easily change class by selecting your preffered
                            <span className="font-medium text-foreground"> class </span>
                            in the designated dropdown.
                        </span>

                        <span>
                            And the most important update: 
                            <span className="font-medium text-foreground"> Drag and Drop </span>
                            names between groups for easy reassignment.
                        </span>

                        <span className="pt-2 block">
                            We hope GroupGenerator helps you!
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}



export const WhatsNewSeatMatch = () => {
    const [open, setOpen] = useState(false);
    
    useEffect(() => {
        const hasSeen = localStorage.getItem("hasSeenWhatsNewSeatMatch");
        if (hasSeen !== "true") {
            setOpen(true);
        }
    }, []);

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            localStorage.setItem("hasSeenWhatsNewSeatMatch", "true");
        }
        setOpen(isOpen);
    };
    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader className="space-y-4">
                    <AlertDialogTitle className="text-2xl font-semibold">
                        What's new in SeatMatch
                    </AlertDialogTitle>

                    <AlertDialogDescription className="flex flex-col text-md leading-relaxed text-muted-foreground space-y-2">
                        <span>
                            In this version we have many brought new features to
                            <span className="font-medium text-foreground">
                                {" "}SeatMatch{" "}
                            </span>
                        </span>

                        <span>
                            For the first time you are able to change
                            <span className="font-medium text-foreground">
                                {" "}seating arrangements.{" "}
                            </span> 
                            Just select a predefined arrangement in the dropdown.
                        </span>

                        <span>
                            In this version you are also able to change your
                            <span className="font-medium text-foreground"> class </span>
                            with the dropdown.
                        </span>

                        <span>
                            And the most important update: You are now able to 
                            <span className="font-medium text-foreground"> Drag and Drop </span>
                            names for easy reassignment.
                        </span>

                        <span className="pt-2 block">
                            We hope SeatMatch helps you!
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}