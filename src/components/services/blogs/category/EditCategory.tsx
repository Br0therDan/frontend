'use client';
import React from 'react';
import {
  useForm,
  SubmitHandler,
  FormProvider,
} from 'react-hook-form';
import { CategoryPublic, CategoryUpdate } from '@/client/blog';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogOverlay,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormMessage } from '@/components/ui/form';
import { MyButton } from '@/components/common/buttons/submit-button';
import { CategoryService } from '@/lib/api';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Loading from '@/components/common/Loading';
import { handleApiError } from '@/lib/errorHandler';

interface EditCategoryProps {
  category: CategoryPublic;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditCategory({
  category,
  isOpen,
  onClose,
}: EditCategoryProps) {
  const [loading, setLoading] = useState(false);
  const methods = useForm<CategoryUpdate>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: {
      ...category,
      subcategories:
        category.subcategories?.map((subcategory) => subcategory.name) || [],
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const subcategories = watch('subcategories');

  const onSubmit: SubmitHandler<CategoryUpdate> = async (data) => {
    setLoading(true);
    try {
      await CategoryService.categoriesUpdateCategory(category._id, data);
      // toast({
      //   title: "Success!",
      //   description: "Category updated successfully.",
      // });
      toast.success('Success!', {
        description: 'Category updated successfully.',
      });
      reset();
      onClose();
    } catch (err) {
      handleApiError(err, (message) => toast.error(message.title));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  const handleAddSubcategory = () => {
    setValue('subcategories', [...(subcategories || []), '']);
  };

  const handleRemoveSubcategory = (index: number) => {
    const newSubcategories = [...(subcategories || [])];
    newSubcategories.splice(index, 1);
    setValue('subcategories', newSubcategories);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <FormProvider {...methods}>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <DialogOverlay />
        <DialogContent className="max-w-md">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle className="text-2xl">카테고리 편집</DialogTitle>
              <DialogDescription>카테고리를 수정합니다.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Category Name */}
              <div className="grid gap-2">
                <Label htmlFor="name">카테고리</Label>
                <Input
                  id="name"
                  {...register('name', {
                    required: '카테고리 이름은 필수입니다 ',
                  })}
                  type="text"
                />
                {errors.name && (
                  <FormMessage>{errors.name.message}</FormMessage>
                )}
              </div>

              {/* Subcategories */}
              <div className="grid gap-2">
                <Label htmlFor="subcategories">서브 카테고리</Label>
                {subcategories?.map((subcategory, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      {...register(`subcategories.${index}`)}
                      placeholder="서브 카테고리"
                      type="text"
                      value={subcategory}
                    />
                    <Button
                      type="button"
                      variant={'outline'}
                      onClick={() => handleRemoveSubcategory(index)}
                      className="text-sm"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant={'outline'}
                  onClick={handleAddSubcategory}
                  className="mt-2 text-sm"
                >
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <DialogFooter className="flex justify-end gap-3 pt-2">
              <MyButton
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="w-full"
                type="button"
              >
                Cancel
              </MyButton>
              <MyButton
                variant="default"
                type="submit"
                isLoading={isSubmitting}
                // disabled={!isDirty}
                className="w-full"
              >
                Save
              </MyButton>
            </DialogFooter>
          </form>
          <DialogClose className="absolute top-4 right-4" />
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}
