"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CButton,
  CHeader,
  CHeaderToggler,
  CNavItem,
  CNavLink,
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarNav,
} from "@coreui/react";
import { logOut } from "./actions";
import styles from "./private-shell.module.css";

const navigation = [
  { label: "Inicio", href: "/dashboard" },
  { label: "Mis cursos", href: "/cursos" },
  { label: "Asistencia", href: "/asistencia" },
  { label: "Calificaciones", href: "/calificaciones" },
  { label: "Mi perfil", href: "/perfil" },
];

function pageTitle(pathname) {
  if (pathname.startsWith("/perfil")) return "Mi perfil";
  if (pathname.startsWith("/asistencia")) return "Asistencia";
  if (pathname.startsWith("/calificaciones")) return "Calificaciones";
  if (pathname.startsWith("/cursos")) return "Mis cursos";
  return "Inicio";
}

export default function PrivateShell({ user, children }) {
  const pathname = usePathname();
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    const updateSidebarVisibility = () => {
      setSidebarVisible(!window.matchMedia("(max-width: 991.98px)").matches);
    };

    updateSidebarVisibility();
    window.addEventListener("resize", updateSidebarVisibility);
    return () => window.removeEventListener("resize", updateSidebarVisibility);
  }, []);

  const closeSidebarOnMobile = () => {
    if (window.matchMedia("(max-width: 991.98px)").matches) {
      setSidebarVisible(false);
    }
  };

  return (
    <div className={styles.shell}>
      <CSidebar
        className={styles.sidebar}
        colorScheme="light"
        placement="start"
        position="fixed"
        visible={sidebarVisible}
        onVisibleChange={setSidebarVisible}
      >
        <CSidebarHeader className="border-bottom px-3">
          <CSidebarBrand as={Link} href="/dashboard" className={styles.brand}>
            Planificación Docente
          </CSidebarBrand>
        </CSidebarHeader>
        <CSidebarNav className="px-2 py-3">
          {navigation.map((item) => (
            <CNavItem key={item.href}>
              <CNavLink
                as={Link}
                href={item.href}
                active={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`))}
                onClick={closeSidebarOnMobile}
              >
                {item.label}
              </CNavLink>
            </CNavItem>
          ))}
        </CSidebarNav>
      </CSidebar>

      <div className={styles.main}>
        <CHeader position="sticky" className={`border-bottom px-3 px-lg-4 ${styles.header}`}>
          <CHeaderToggler
            className={`d-lg-none me-2 ${styles.menuButton}`}
            aria-label="Abrir navegación"
            onClick={() => setSidebarVisible((visible) => !visible)}
          >
            Menú
          </CHeaderToggler>
          <div className={styles.headerTitle}>{pageTitle(pathname)}</div>
          <div className={styles.userControls}>
            <span className={styles.userName}>{user.nombre} {user.apellido}</span>
            <form action={logOut}>
              <CButton color="light" size="sm" type="submit">Cerrar sesión</CButton>
            </form>
          </div>
        </CHeader>
        <main className="p-3 p-lg-4">{children}</main>
      </div>
    </div>
  );
}