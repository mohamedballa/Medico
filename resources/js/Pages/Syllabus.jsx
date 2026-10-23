import { Head, router } from "@inertiajs/react";
import { ModuleRow } from "../components/ModuleRow";

// TEMPORARY: sample data so you can see the page before the controller exists.
// Delete this once Laravel sends real `subjects` props.
const sampleSubjects = [
    {
        id: 1,
        name: "Anatomy",
        description: "Systematic and regional study of the human physical structure, organs, and spatial relationships.",
        status: "current",
    },
    { id: 2, name: "Physiology", description: "", status: "locked" },
    { id: 3, name: "Biochemistry", description: "", status: "locked" },
];

export default function Syllabus({ subjects = sampleSubjects }) {
    const handleSubjectClick = (subject) => {
        if (subject.status === "locked") {
            router.visit("/subscribe");
            return;
        }
        router.visit(`/syllabus/${subject.id}`);
    };

    return (
        <>
            <Head title="Syllabus" />
            <div className="bg-primary min-h-screen flex flex-col pb-16">
                <div className="h-[150px]"></div>

                <div className="w-full py-8 sm:py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight">
                            Curriculum Syllabus
                        </h1>
                        <p className="font-sans text-white/85 text-sm sm:text-base mt-2 max-w-xl">
                            Select a core curriculum subject to explore structured chapters, folios, and active recall decks.
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto w-full px-4 sm:px-6">
                    <div className="space-y-4 sm:space-y-5">
                        {subjects.map((subject) => (
                            <ModuleRow
                                key={subject.id}
                                title={subject.name}
                                subtitle={subject.description}
                                status={subject.status}
                                onClick={() => handleSubjectClick(subject)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}




