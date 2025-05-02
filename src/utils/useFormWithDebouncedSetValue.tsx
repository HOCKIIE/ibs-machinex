import { useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import { UseFormSetValue, UseFormTrigger } from 'react-hook-form';

export function useFormWithDebouncedSetValue<T>(
  setValue: UseFormSetValue<T>,
  trigger: UseFormTrigger<T>,
  delay = 500
) {
  const debouncedRef = useRef<{ [key: string]: (...args: any[]) => void }>({});

  const setDebouncedValue = useCallback(
    (name: keyof T, value: any) => {
      if (!debouncedRef.current[name as string]) {
        debouncedRef.current[name as string] = debounce((v: any) => {
          setValue(name, v, { shouldValidate: true });
          trigger(name);
        }, delay);
      }
      debouncedRef.current[name as string](value);
    },
    [setValue, trigger, delay]
  );

  return { setDebouncedValue };
}