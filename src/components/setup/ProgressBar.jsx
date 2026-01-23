import { Check } from "lucide-react";

const ProgressBar = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-6 py-6">
        {/* Step indicators */}
        <div className="hidden md:flex items-center justify-between relative">
          {/* Connecting line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
          <div
            className="absolute top-5 left-0 h-0.5 bg-gray-900 -z-10 transition-all duration-500"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isClickable = index <= currentStep;

            return (
              <button
                key={step.id}
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                className={`
                  flex flex-col items-center gap-3 group relative
                  ${isClickable ? "cursor-pointer" : "cursor-not-allowed"}
                  transition-all duration-200
                `}
              >
                {/* Step circle */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    border-2 transition-all duration-200
                    ${
                      isCompleted
                        ? "bg-gray-900 border-gray-900"
                        : isCurrent
                          ? "bg-white border-gray-900 ring-4 ring-gray-900/10"
                          : "bg-white border-gray-300"
                    }
                    ${isClickable && !isCurrent ? "group-hover:border-gray-500" : ""}
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <span
                      className={`
                        text-sm font-semibold
                        ${isCurrent ? "text-gray-900" : "text-gray-400"}
                      `}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Step label */}
                <div className="flex flex-col items-center min-w-[100px]">
                  <span
                    className={`
                      text-xs font-semibold text-center
                      ${isCurrent ? "text-gray-900" : "text-gray-500"}
                      ${isClickable && !isCurrent ? "group-hover:text-gray-700" : ""}
                    `}
                  >
                    {step.label}
                  </span>
                  <span className="text-xs text-gray-400 text-center mt-1 hidden lg:block">
                    {step.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Mobile view - simplified */}
        <div className="md:hidden">
          <div className="flex items-center gap-3">
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center
                bg-gray-900 text-white font-semibold
              `}
            >
              {currentStep + 1}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {steps[currentStep].label}
              </div>
              <div className="text-xs text-gray-500">
                {steps[currentStep].description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
