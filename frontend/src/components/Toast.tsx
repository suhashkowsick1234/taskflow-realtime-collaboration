type ToastProps = {
  message: string;
  type: "success" | "error";
  onClose: () => void;
};

function Toast({ message, type, onClose }: ToastProps) {
  return (
    <div
      className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-lg shadow-lg text-white
      ${type === "success" ? "bg-green-600" : "bg-red-600"}`}
    >
      <div className="flex items-center gap-4">
        <span className="font-semibold">{message}</span>
        <button onClick={onClose} className="text-xl leading-none">
          ×
        </button>
      </div>
    </div>
  );
}

export default Toast;
