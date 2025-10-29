import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import {
  expenseSchema,
  type ExpenseFormData,
  type Expense,
  type Team,
} from "@/types";
import {
  useCreateExpense,
  useUpdateExpense,
  useDeleteExpense,
  useSuggestCategory,
} from "@/hooks";
import { Loader2, X } from "lucide-react";
import { CATEGORIES } from "@/constants";
import { ExpenseStatus } from "@/types";
import { toast } from "sonner";

export function AddExpenseDialog({
  isOpen,
  onClose,
  expense,
  teams,
}: {
  isOpen: boolean;
  onClose: () => void;
  expense?: Expense;
  teams?: Team[];
}) {
  const {
    mutate: createExpense,
    isPending: isCreatingExpense,
    error: createExpenseError,
    reset: resetCreateExpense,
  } = useCreateExpense();
  const {
    mutate: updateExpense,
    isPending: isUpdatingExpense,
    error: updateExpenseError,
    reset: resetUpdateExpense,
  } = useUpdateExpense();
  const {
    mutate: deleteExpense,
    isPending: isDeletingExpense,
    error: deleteExpenseError,
    reset: resetDeleteExpense,
  } = useDeleteExpense();
  const {
    mutate: suggestCategory,
    isPending: isSuggestingCategory,
    data: aiSuggestion,
  } = useSuggestCategory();

  const [showAISuggestion, setShowAISuggestion] = useState(false);

  const isEditMode = !!expense;

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      teamId:
        typeof expense?.teamId === "string"
          ? expense?.teamId
          : expense?.teamId?._id || "",
      amount: expense?.amount || undefined,
      description: expense?.description || "",
      category: expense?.category || "",
      status: expense?.status || "pending",
    },
  });

  const { reset, clearErrors, watch, setValue } = form;

  const description = watch("description");

  useEffect(() => {
    if (!isEditMode && description && description.length >= 5) {
      const timer = setTimeout(() => {
        suggestCategory(
          { description },
          {
            onSuccess: (data) => {
              if (data.confidence >= 70) {
                setShowAISuggestion(true);
                if (data.confidence >= 85 && !form.getValues("category")) {
                  setValue("category", data.category);
                }
              }
            },
          }
        );
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      setShowAISuggestion(false);
    }
  }, [description, isEditMode, suggestCategory, setValue, form]);

  useEffect(() => {
    resetCreateExpense();
    resetUpdateExpense();
    resetDeleteExpense();
    setShowAISuggestion(false);
    if (expense) {
      form.reset({
        teamId:
          typeof expense.teamId === "string"
            ? expense.teamId
            : expense.teamId._id,
        amount: expense.amount || undefined,
        description: expense.description || "",
        category: expense.category || "",
        status: expense.status || "pending",
      });
    } else {
      form.reset({
        teamId: "",
        amount: undefined,
        description: "",
        category: "",
        status: "pending",
      });
    }
  }, [expense, form]);

  const handleClose = () => {
    reset();
    clearErrors();
    onClose();
  };

  const handleApplyAISuggestion = () => {
    if (aiSuggestion) {
      setValue("category", aiSuggestion.category);
      setShowAISuggestion(false);
    }
  };

  const onSubmit = (data: ExpenseFormData) => {
    const finalData = {
      ...data,
      date: expense?.date || new Date().toISOString(),
      status: data.status || "pending",
    };
    try {
      if (isEditMode && expense?._id) {
        updateExpense(
          { id: expense?._id, data: finalData },
          {
            onSuccess: () => {
              handleClose();
              toast.success("Expense updated successfully");
            },
            onError: () => {
              setTimeout(() => {
                handleClose();
              }, 2000);
            },
          }
        );
      } else {
        createExpense(finalData, {
          onSuccess: () => {
            handleClose();
            toast.success("Expense created successfully");
          },
          onError: () => {
            setTimeout(() => {
              handleClose();
            }, 2000);
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const error = createExpenseError || updateExpenseError || deleteExpenseError;
  const errorMessage =
    (createExpenseError as any)?.response?.data?.error ||
    (updateExpenseError as any)?.response?.data?.error ||
    "Something went wrong. Please try again.";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        {error ? (
          <div className="flex flex-col justify-center items-center h-full min-h-50 gap-2">
            <X className="h-8 w-8 text-red-500" />
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Edit Expense" : "Add Expense"}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <fieldset disabled={isCreatingExpense || isUpdatingExpense}>
                {(isCreatingExpense || isUpdatingExpense) && (
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 text-primary animate-spin" />
                  </div>
                )}
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    name="teamId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a team" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {teams?.map((team) => (
                              <SelectItem key={team._id} value={team._id}>
                                {team.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0.00"
                            className="h-11"
                            {...field}
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
                    name="description"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter description"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            Category
                            {isSuggestingCategory && (
                              <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                            )}
                          </span>
                          {showAISuggestion &&
                            aiSuggestion &&
                            aiSuggestion.confidence >= 70 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs gap-1"
                                onClick={handleApplyAISuggestion}
                              >
                                Use AI suggestion
                              </Button>
                            )}
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isSuggestingCategory}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATEGORIES.map((category) => (
                              <SelectItem
                                key={category.value}
                                value={category.value}
                              >
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {showAISuggestion &&
                          aiSuggestion &&
                          aiSuggestion.confidence >= 70 && (
                            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="flex items-start gap-2">
                                <p className="text-sm font-medium text-blue-900">
                                  AI suggests:{" "}
                                  <span className="capitalize">
                                    {aiSuggestion.category}
                                  </span>
                                </p>
                              </div>
                            </div>
                          )}

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isEditMode && (
                    <FormField
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(ExpenseStatus).map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status.charAt(0).toUpperCase() +
                                    status.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 h-11 gap-2"
                      disabled={isCreatingExpense || isUpdatingExpense}
                    >
                      {isCreatingExpense || isUpdatingExpense
                        ? "Saving..."
                        : isEditMode
                        ? "Update Expense"
                        : "Add Expense"}
                    </Button>
                    <Button
                      type="button"
                      variant={isEditMode ? "destructive" : "outline"}
                      className="flex-1 h-11"
                      onClick={() =>
                        isEditMode && expense?._id
                          ? deleteExpense(expense?._id)
                          : onClose()
                      }
                      disabled={isDeletingExpense}
                    >
                      {isDeletingExpense
                        ? "Deleting..."
                        : isEditMode
                        ? "Delete Expense"
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
