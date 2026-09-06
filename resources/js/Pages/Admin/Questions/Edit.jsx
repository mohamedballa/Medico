import { useForm } from '@inertiajs/react';
import AdminPage, { moduleTrail } from '@/components/Admin/AdminPage';
import QuestionForm, { toFormChoices, toQuestionPayload } from '@/components/Admin/QuestionForm';
import { normalizeDocument } from '@/components/Admin/EditorJsField';

export default function Edit({ question }) {
    const form = useForm({
        question_text: normalizeDocument(question.question_text),
        type: question.type,
        correct_answer: question.correct_answer ?? '',
        explanation: normalizeDocument(question.explanation),
        order: question.order,
        choices: toFormChoices(question.choices),
    });

    const submit = (e) => {
        e.preventDefault();
        form.transform(toQuestionPayload);
        form.put(route('admin.questions.update', question.id));
    };

    return (
        <AdminPage
            title="Edit Question"
            heading="Edit Question"
            subheading={moduleTrail(question.module)}
            widthClass="max-w-4xl"
        >
            <QuestionForm
                form={form}
                onSubmit={submit}
                submitLabel="Update Question"
                cancelHref={route('admin.questions.index', { module: question.module_id })}
            />
        </AdminPage>
    );
}
