import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { teamSchema, type TeamFormData, type Team } from "@/types";
import { useCreateTeam, useUpdateTeam, useDeleteTeam } from "@/hooks";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

export function AddTeamDialog({
  isOpen,
  onClose,
  team,
}: {
  isOpen: boolean;
  onClose: () => void;
  team?: Team;
}) {
  const {
    mutate: createTeam,
    isPending: isCreatingTeam,
    error: createTeamError,
    reset: resetCreateTeam,
  } = useCreateTeam();
  const {
    mutate: updateTeam,
    isPending: isUpdatingTeam,
    error: updateTeamError,
    reset: resetUpdateTeam,
  } = useUpdateTeam();
  const {
    mutate: deleteTeam,
    isPending: isDeletingTeam,
    error: deleteTeamError,
    reset: resetDeleteTeam,
  } = useDeleteTeam();
  const isEditMode = !!team;

  const form = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: team?.name || "",
      budget: team?.budget || undefined,
      members: team?.members || [],
    },
  });

  const { reset, clearErrors } = form;

  useEffect(() => {
    resetCreateTeam();
    resetUpdateTeam();
    resetDeleteTeam();
    if (team) {
      form.reset({
        name: team.name || "",
        budget: team.budget || undefined,
        members: team.members || [],
      });
    } else {
      form.reset({
        name: "",
        budget: undefined,
        members: [],
      });
    }
  }, [team, form]);

  const handleClose = () => {
    reset();
    clearErrors();
    onClose();
  };

  const onSubmit = (data: TeamFormData) => {
    try {
      if (isEditMode && team?._id) {
        updateTeam(
          { id: team?._id, data },
          {
            onSuccess: () => {
              handleClose();
              toast.success("Team updated successfully");
            },
            onError: () => {
              setTimeout(() => {
                handleClose();
              }, 1000);
            },
          }
        );
      } else {
        createTeam(data, {
          onSuccess: () => {
            handleClose();
            toast.success("Team created successfully");
          },
          onError: () => {
            setTimeout(() => {
              handleClose();
            }, 1000);
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const error = createTeamError || updateTeamError || deleteTeamError;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        {error ? (
          <div className="flex justify-center items-center h-full min-h-50">
            <X className="h-4 w-4 text-red-500" />
            <p className="text-sm text-red-600">
              {error?.message || "Something went wrong. Please try again."}
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Edit Team" : "Add Team"}</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <fieldset disabled={isCreatingTeam || isUpdatingTeam}>
                {(isCreatingTeam || isUpdatingTeam) && (
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 text-primary animate-spin" />
                  </div>
                )}
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter team name"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0.00"
                            className="h-11"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="members"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Members</FormLabel>
                        <div className="space-y-2">
                          {field.value && field.value.length > 0
                            ? field.value.map(
                                (member: string, index: number) => (
                                  <div key={index} className="flex gap-2">
                                    <Input
                                      placeholder="member@example.com"
                                      className="h-11 flex-1"
                                      value={member}
                                      onChange={(e) => {
                                        const newMembers = [...field.value];
                                        newMembers[index] = e.target.value;
                                        field.onChange(newMembers);
                                      }}
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => {
                                        const newMembers = field.value.filter(
                                          (_: string, i: number) => i !== index
                                        );
                                        field.onChange(newMembers);
                                      }}
                                      className="h-11 w-11"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )
                              )
                            : null}
                          <FormMessage />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              field.onChange([...(field.value || []), ""])
                            }
                            className="w-full h-11"
                          >
                            + Add Member
                          </Button>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 h-11 gap-2"
                      disabled={isCreatingTeam || isUpdatingTeam}
                    >
                      {isCreatingTeam || isUpdatingTeam
                        ? "Saving..."
                        : isEditMode
                        ? "Update Team"
                        : "Add Team"}
                    </Button>
                    <Button
                      type="button"
                      variant={isEditMode ? "destructive" : "outline"}
                      className="flex-1 h-11"
                      onClick={() =>
                        isEditMode && team?._id
                          ? deleteTeam(team?._id)
                          : onClose()
                      }
                      disabled={isDeletingTeam}
                    >
                      {isDeletingTeam
                        ? "Deleting..."
                        : isEditMode
                        ? "Delete Team"
                        : "Cancel"}
                    </Button>
                  </div>
                </form>
              </fieldset>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
