import { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import List from '@editorjs/list';
import Table from '@editorjs/table';
import ImageTool from '@editorjs/image';

export const EMPTY_DOCUMENT = { blocks: [] };

/** Editor.js only accepts its own document shape; legacy/seeded strings are discarded. */
export function normalizeDocument(value) {
    return value && Array.isArray(value.blocks) ? value : EMPTY_DOCUMENT;
}

async function uploadByFile(file) {
    const formData = new FormData();
    formData.append('image', file);

    try {
        // axios attaches the XSRF token cookie header automatically.
        const { data } = await window.axios.post(route('admin.upload-image'), formData);
        return { success: 1, file: { url: data.url } };
    } catch (error) {
        const message =
            error.response?.data?.errors?.image?.[0] ??
            error.response?.data?.message ??
            'Image upload failed.';
        return { success: 0, message };
    }
}

const BASIC_TOOLS = { header: Header, paragraph: Paragraph, list: List };

const RICH_TOOLS = {
    ...BASIC_TOOLS,
    table: Table,
    image: { class: ImageTool, config: { uploader: { uploadByFile } } },
};

/**
 * Controlled Editor.js wrapper.
 *
 * `value` is only read on mount (Editor.js owns its DOM after that); every
 * change is reported through `onChange` with the saved document.
 */
export default function EditorJsField({ value, onChange, rich = false, minHeightClass = 'min-h-64' }) {
    const holderRef = useRef(null);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    useEffect(() => {
        const editor = new EditorJS({
            holder: holderRef.current,
            tools: rich ? RICH_TOOLS : BASIC_TOOLS,
            data: normalizeDocument(value),
            onChange: async (api) => {
                const saved = await api.saver.save();
                onChangeRef.current?.(saved);
            },
        });

        return () => {
            editor.isReady.then(() => editor.destroy()).catch(() => {});
        };
        // Mount-only by design: see docblock.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div ref={holderRef} className={`border rounded p-4 bg-gray-50 ${minHeightClass}`} />;
}
