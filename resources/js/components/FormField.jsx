import { Link } from "@inertiajs/react";


export default function FormField({
    label,
    name,
    type ='text',
    value,
    onChange,
    error,
    rows, 
    children,
    placeholder = '',
}){
    const baseClass = " mt-1 block w-full border border-grey-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" ;

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>

            {type === 'textarea' ? (
                <textarea
                    value={value}
                    onChange={onChange}
                    rows={rows ?? 3}
                    placeholder={placeholder}
                    className={baseClass}
                />
            ) : type === 'select' ? (
                <select value={value} onChange={onChange} className={baseClass}>
                    {children}
                </select>
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={baseClass}
                />
            )}

            {error && (
                <p className="mt-1 text-red-600 text-sm">{error}</p>
            )}
        </div>
    );
} 