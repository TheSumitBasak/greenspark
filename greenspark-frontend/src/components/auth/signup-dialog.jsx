"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


export function SignupDialog({ children }) {
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState("buyer")
  const router = useRouter()

  const onContinue = () => {
    setOpen(false)
    router.push(`/register?role=${role}`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Sign up</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Choose your role to begin registration. Verification is required before trading.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            onContinue()
          }}
        >
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-foreground">I am a</legend>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`cursor-pointer rounded-md border p-3 text-center ${
                  role === "buyer" ? "border-primary ring-1 ring-primary" : "border-border"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="buyer"
                  className="sr-only"
                  checked={role === "buyer"}
                  onChange={() => setRole("buyer")}
                />
                <span className="block text-sm font-semibold text-foreground">Buyer</span>
                <span className="mt-1 block text-xs text-muted-foreground">Purchase verified green H2</span>
              </label>

              <label
                className={`cursor-pointer rounded-md border p-3 text-center ${
                  role === "seller" ? "border-primary ring-1 ring-primary" : "border-border"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="seller"
                  className="sr-only"
                  checked={role === "seller"}
                  onChange={() => setRole("seller")}
                />
                <span className="block text-sm font-semibold text-foreground">Seller</span>
                <span className="mt-1 block text-xs text-muted-foreground">List verified production</span>
              </label>
            </div>
          </fieldset>

          <DialogFooter className="flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Continue
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
