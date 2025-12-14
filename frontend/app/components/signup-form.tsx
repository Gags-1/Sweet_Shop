import { AtSign, GalleryVerticalEnd, Key, User } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Form, useNavigation } from "react-router";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Spinner } from "~/components/ui/spinner";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form method="post" replace>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Mithai Inc.</span>
            </a>
            <h1 className="text-xl font-bold">Create your account</h1>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Login
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="name">Username</Label>

              <InputGroup>
                <InputGroupAddon>
                  <User />
                </InputGroupAddon>
                <InputGroupInput
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  name="name"
                />
              </InputGroup>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <InputGroup>
                <InputGroupAddon>
                  <AtSign />
                </InputGroupAddon>
                <InputGroupInput
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  name="email"
                  autoComplete="email"
                />
              </InputGroup>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>

              <InputGroup>
                <InputGroupAddon>
                  <Key />
                </InputGroupAddon>
                <InputGroupInput
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  name="password"
                  autoComplete="new-password"
                />
              </InputGroup>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="confirm-password">Confirm Password</Label>

              <InputGroup>
                <InputGroupAddon>
                  <Key />
                </InputGroupAddon>
                <InputGroupInput
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  name="confirm-password"
                  autoComplete="new-password"
                />
              </InputGroup>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Spinner className="mr-2" />}
              Sign Up
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
