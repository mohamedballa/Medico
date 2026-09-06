import { useForm } from '@inertiajs/react';
import AdminPage, { moduleTrail } from '@/components/Admin/AdminPage';
import QuestionForm, { EMPTY_DOCUMENT, QUESTION_TYPES, toFormChoices, toQuestionPayload } from '@/components/Admin/QuestionForm';

export default function Create({ module }) {
    const form = useForm({
        module_id: module.id,
        question_text: EMPTY_DOCUMENT,
        type: QUESTION_TYPES.MCQ,
        correct_answer: '',
        explanation: EMPTY_DOCUMENT,
        order: 1,
        choices: toFormChoices(),
    });

    const submit = (e) => {
        e.preventDefault();
        form.transform(toQuestionPayload);
        form.post(route('admin.questions.store'));
    };

    return (
        <AdminPage
            title="Create Question"
            heading={<>New Question in <span className="text-green-600">{module.name}</span></>}
            subheading={moduleTrail(module)}
            widthClass="max-w-4xl"
        >
            <QuestionForm
                form={form}
                onSubmit={submit}
                submitLabel="Create Question"
                cancelHref={route('admin.questions.index', { module: module.id })}
            />
        </AdminPage>
    );
}
