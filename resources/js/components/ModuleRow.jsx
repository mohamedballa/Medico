import { Check, ChevronRight, Lock } from "lucide-react";
import { IllustrationGraphic } from "./IllustrationGraphic";

export const ModuleRow = ({
    title,
    subtitle,
    status,
    onClick,
    graphicType = "skull",
}) => {
    const isLocked = status === "locked";

    return (
        <div
            onClick={onClick}
            className={`relative w-full bg-[#FFFFFE] rounded-2xl p-4 sm:p-5 flex items-center justify-between transition-all duration-200 border border-slate-100/80 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 ${
                isLocked ? "opacity-90" : ""
            }`}
            style={{ boxShadow: "0 4px 16px rgba(9, 64, 103, 0.10)" }}
        >
            {/* Left side: thumbnail and titles */}
            <div className="flex items-center space-x-4 sm:space-x-5 min-w-0 pr-2">
                <div className="relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden">
                    <IllustrationGraphic
                        type={graphicType}
                        className="w-12 h-12 sm:w-14 sm:h-14"
                    />
                </div>

                <div className="min-w-0">
                    <h3 className="font-serif text-lg sm:text-xl font-medium text-[#094067] truncate">
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="font-sans text-xs sm:text-sm text-[#5F6C7B] truncate mt-0.5">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            {/* Right side: status icon */}
            <div className="shrink-0 ml-3">
                {status === "complete" && (
                    <div
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#00E593] flex items-center justify-center text-white shadow-sm"
                        title="Completed"
                    >
                        <Check className="w-5 h-5" strokeWidth={2.8} />
                    </div>
                )}

                {status === "current" && (
                    <div
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#20A0D8] flex items-center justify-center text-white shadow-sm"
                        title="In Progress"
                    >
                        <ChevronRight className="w-5 h-5" strokeWidth={2.8} />
                    </div>
                )}

                {status === "locked" && (
                    <div
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#E2E8F0]/70 border-2 border-[#CCCCCC] flex items-center justify-center text-[#94A3B8]"
                        title="Locked"
                    >
                        <Lock className="w-4 h-4" />
                    </div>
                )}
            </div>
        </div>
    );
};