"use client";
import { APPInfo } from "web-dc-api";
import { Button } from "antd-mobile";
import { CheckShieldFill } from "antd-mobile-icons";
import Card from "@/components/ui/Card";
import { useTranslation } from "react-i18next";

interface AddDAPPNoteProps {
  info: APPInfo;
  confirmFun: () => void;
}
export default function AddDAPPNote(props: AddDAPPNoteProps) {
  const { info, confirmFun } = props;
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <CheckShieldFill fontSize={28} color="white" />
          </div>
        </div>
        <div className="mb-2 text-sm text-blue-400 break-words">
          {info.appUrl}
        </div>
        <div className="font-semibold text-lg mb-2">
          {t("DAPP.app")} {info.appName} {info.appVersion}
        </div>
        <div className="mt-4 text-sm font-bold text-amber-500">
          {t("DAPP.add_tip")}
        </div>

        <div className="flex gap-4 mt-6">
          <div className="flex-1">
            <Button
              color="primary"
              fill="outline"
              onClick={() => {
                window.close();
              }}
              block
            >
              {t("common.cancel")}
            </Button>
          </div>
          <div className="flex-1">
            <Button color="primary" fill="solid" onClick={confirmFun} block>
              {t("common.confirm", "确认")}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
