"use client"

import React, { useState, useRef, useEffect } from "react"
import { useColorMode } from "@docusaurus/theme-common"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"
import styles from "./styles.module.css"

// Для by локали используется ru домен для чат-центра
const getChatCenterDomain = (locale: Region): "ru" | "kz" => {
  return locale === "by" ? "ru" : locale
}

type ThemeMode = "light" | "dark"
type Region = "by" | "ru" | "kz"

type ProductConfig = {
  url: string
  logoLight: string
  logoDark: string
}

type Product = {
  url: string
  logo: string
}

const ALLOWED_REGIONS: Region[] = ["by", "ru", "kz"]

const normalizeRegion = (value: unknown): Region => {
  if (typeof value !== "string") {
    return "ru"
  }

  return ALLOWED_REGIONS.includes(value as Region) ? (value as Region) : "ru"
}

const MAIN_LOGO = {
  light: "/img/pulse_black.svg",
  dark: "/img/pulse_white.svg",
} as const

const getProducts = (locale: Region, mode: ThemeMode): Product[] => {
  const chatCenterDomain = getChatCenterDomain(locale)
  const products: ProductConfig[] = [
    {
      url: `https://docs-chatcenter.edna.${chatCenterDomain}`,
      logoLight: "/img/cc_black.svg",
      logoDark: "/img/cc_white.svg",
    },
  ]
  
  // Enterprise доступен только для ru локали
  if (locale === "ru") {
    products.push({
      url: "https://docs-enterprise.edna.ru",
      logoLight: "/img/enterprise_black.svg",
      logoDark: "/img/enterprise_white.svg",
    })
  }
  
  return products.map((product) => ({
    url: product.url,
    logo: mode === "dark" ? product.logoDark : product.logoLight,
  }))
}

export default function NavbarLogoDropdown() {
  const { colorMode } = useColorMode()
  const { siteConfig } = useDocusaurusContext()
  const mode: ThemeMode = colorMode === "dark" ? "dark" : "light"

  const locale = normalizeRegion(siteConfig.customFields?.region)

  const products = getProducts(locale, mode)
  const logo = MAIN_LOGO[mode]

  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className={styles.logoDropdownWrapper} ref={wrapperRef}>
      <a href="/" className={styles.logoLink}>
        <img src={logo} alt="Main Logo" className={styles.logo} data-no-zoom />
      </a>

      <button
        className={`${styles.dropdownToggle} ${open ? styles.open : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle products menu"
      />

      <ul className={`${styles.dropdownMenu} ${open ? styles.open : ""}`}>
        {products.map((p, index) => (
          <li key={p.url || `product-${index}`} className={styles.dropdownItem}>
            <a href={p.url} onClick={() => setOpen(false)}>
              <img src={p.logo} alt="" className={styles.dropdownItemLogo} data-no-zoom />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}