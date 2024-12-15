
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
  } from "@/components/ui/dialog"
  
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"



export default function ChangeNameDialog() {


    return (

    <Dialog>
      <DialogTrigger asChild>
        <p>Change name</p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-start">
            <Button type = "button" variant="ghost">
                Cancel
            </Button>
          <DialogClose asChild>
            <Button type="button" variant="default">
              Ok
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    );

}