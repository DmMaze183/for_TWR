"use client"

import React, { useState, useRef, useEffect } from "react"
import { useColorMode } from "@docusaurus/theme-common"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"
import styles from "./styles.module.css"

// Для by локали используется ru домен для чат-центра
const getChatCenterDomain = (locale: string) => {
  return locale === "by" ? "ru" : locale
}

const getProductsLight = (locale: string) => {
  const chatCenterDomain = getChatCenterDomain(locale)
  const products = [
    {
      url: `https://docs-chatcenter.edna.${chatCenterDomain}`,
      logo: "/img/cc-logo-white.svg",
    },
  ]
  
  // Enterprise доступен только для ru локали
  if (locale === "ru") {
    products.push({
      url: "https://docs-enterprise.edna.ru",
      logo: "/img/enterprise_black.svg",
    })
  }
  
  return products
}

const getProductsDark = (locale: string) => {
  const chatCenterDomain = getChatCenterDomain(locale)
  const products = [
    {
      url: `https://docs-chatcenter.edna.${chatCenterDomain}`,
      logo: "/img/cc-logo.svg",
    },
  ]
  
  // Enterprise доступен только для ru локали
  if (locale === "ru") {
    products.push({
      url: "https://docs-enterprise.edna.ru",
      logo: "/img/enterprise_white.svg",
    })
  }
  
  return products
}

export default function NavbarLogoDropdown() {
  const { colorMode } = useColorMode()
  const { siteConfig } = useDocusaurusContext()
  const isDark = colorMode === "dark"

  const locale = (siteConfig.customFields?.region as "by" | "ru" | "kz") || "ru"

  const products = isDark ? getProductsDark(locale) : getProductsLight(locale)
  const logo = isDark ? "/img/logo_pulse.svg" : "/img/logo_black.svg"

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
