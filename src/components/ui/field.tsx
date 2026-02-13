import { Field as ChakraField } from "@chakra-ui/react"
import * as React from "react"

/**
 * Chakra UI v3 typing workaround.
 * Field subcomponents incorrectly disallow `children` in their TS definitions.
 */
type WithChildren<P = {}> = P & { children?: React.ReactNode }

const FieldLabel = ChakraField.Label as unknown as React.FC<
  WithChildren<{ asChild?: boolean }>
>

const FieldHelperText = ChakraField.HelperText as unknown as React.FC<
  WithChildren
>

const FieldErrorText = ChakraField.ErrorText as unknown as React.FC<
  WithChildren
>

export interface FieldProps
  extends Omit<ChakraField.RootProps, "label"> {
  label?: React.ReactNode
  helperText?: React.ReactNode
  errorText?: React.ReactNode
  optionalText?: React.ReactNode
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  function Field(props, ref) {
    const { label, children, helperText, errorText, optionalText, ...rest } =
      props

    return (
      <ChakraField.Root ref={ref} {...rest}>
        {label && (
          <FieldLabel asChild>
            <label>
              {label}
              <ChakraField.RequiredIndicator fallback={optionalText} />
            </label>
          </FieldLabel>
        )}

        {children}

        {helperText && (
          <FieldHelperText>{helperText}</FieldHelperText>
        )}

        {errorText && (
          <FieldErrorText>{errorText}</FieldErrorText>
        )}
      </ChakraField.Root>
    )
  }
)
