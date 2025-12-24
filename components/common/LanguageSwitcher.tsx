"use client";
import React from "react";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { I18N_LANGUAGES } from "@/config/constant";
import { Popover } from "antd-mobile";
import { Action } from "antd-mobile/es/components/popover";

interface LanguageSwitcherProps {
  className?: string;
  iconColor?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className, iconColor = "text-white" }) => {
  const { i18n } = useTranslation();

  const actions: Action[] = [
    { key: I18N_LANGUAGES.ZH, text: "中文" },
    { key: I18N_LANGUAGES.EN, text: "English" },
  ];

  const onSelect = (node: Action) => {
    i18n.changeLanguage(node.key as string);
  };

  return (
    <Popover.Menu
      actions={actions}
      onAction={onSelect}
      placement="bottom-end"
      trigger="click"
    >
      <button className={`p-2 rounded-full hover:bg-white/10 transition-colors ${className}`}>
        <Languages size={20} className={iconColor} />
      </button>
    </Popover.Menu>
  );
};

export default LanguageSwitcher;
