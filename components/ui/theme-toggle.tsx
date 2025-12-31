"use client"

import { IconButton } from "@chakra-ui/react"
import { useColorMode } from "../ui/color-mode"
import { LuSun, LuMoon } from "react-icons/lu"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()
  const [mounted, setMounted] = useState(false)

  // useEffect only runs on the client. 
  // This tells the component it's safe to show the correct icon.
  useEffect(() => {
    setMounted(true)
  }, [])

  // If not mounted, we render a placeholder (or nothing) to match the server
  if (!mounted) {
    return <IconButton variant="ghost" size="lg" disabled aria-label="Loading theme" />
  }

  return (
    <motion.div
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
    >
      <IconButton
        onClick={toggleColorMode}
        variant="ghost"
        aria-label="Toggle theme"
        size="lg"
        borderRadius="full"
        color="teal.500"
      >
        {colorMode === "light" ? <LuMoon /> : <LuSun />}
      </IconButton>
    </motion.div>
  )
}