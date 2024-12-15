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
          <p>Change Name</p>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Name</DialogTitle>
            <DialogDescription>
              Enter your new name below.
            </DialogDescription>
          </DialogHeader>
  
          <Input placeholder="Enter new name" className="mb-4" />
  
          <DialogFooter className="sm:justify-start">
            <Button variant="ghost">Cancel</Button>
            <DialogClose asChild>
              <Button variant="default">Ok</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
  