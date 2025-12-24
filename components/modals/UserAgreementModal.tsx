import React from "react";
import { CloseOutline } from "antd-mobile-icons";
import { useTranslation } from "react-i18next";

interface UserAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserAgreementModal: React.FC<UserAgreementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-slate-900 rounded-2xl shadow-2xl border border-white/10 flex flex-col max-h-[80vh] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
          <h3 className="text-lg font-semibold text-white">
            {t("agreement.title")}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <CloseOutline fontSize={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto text-slate-300 space-y-4 text-sm leading-relaxed">
          <p>{t("agreement.intro")}</p>
          
          <div className="space-y-2">
            <h4 className="text-white font-medium">{t("agreement.decentralization_title")}</h4>
            <p>{t("agreement.decentralization_desc")}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-medium">{t("agreement.custody_title")}</h4>
            <p>{t("agreement.custody_desc")}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-medium">{t("agreement.data_privacy_title")}</h4>
            <p>{t("agreement.data_privacy_desc")}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-medium">{t("agreement.security_title")}</h4>
            <p>{t("agreement.security_desc")}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            {t("common.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAgreementModal;
