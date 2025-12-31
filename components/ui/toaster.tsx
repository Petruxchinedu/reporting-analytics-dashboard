"use client"

import {
  Toaster as ChakraToaster,
  Portal,
  Stack,
  createToaster,
} from "@chakra-ui/react"

// This "toaster" object is what you import in LoginPage to show alerts
export const toaster = createToaster({
  placement: "top-end",
  pauseOnPageIdle: true,
})

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={6}>
        {(toast) => (
          <Stack gap="1" width="full">
            {toast.title && (
              <Box fontWeight="medium" fontSize="sm">
                {toast.title}
              </Box>
            )}
            {toast.description && (
              <Box fontSize="xs" color="fg.muted">
                {toast.description}
              </Box>
            )}
          </Stack>
        )}
      </ChakraToaster>
    </Portal>
  )
}

// Minimal helper Box if not imported
const Box = (props: any) => <div {...props} style={{ display: "flex", flexDirection: "column", ...props.style }} />