import React, { useState } from 'react';
import { IoAddCircleOutline } from 'react-icons/io5';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import BtnLoadingSpinner from '@/app/components/spinner';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    Select,
    SelectItem,
    Textarea,
} from "@heroui/react";

interface AddQuestionProps {
    mutate: () => void;
}

const AddQuestion: React.FC<AddQuestionProps> = ({ mutate }) => {
    const disclosure = useDisclosure();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        status: '',
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            let accessToken =
                typeof window !== 'undefined' && window.sessionStorage
                    ? sessionStorage.getItem('token')
                    : null;

            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            };

            const data = new FormData();
            data.append('question', formData.question);
            data.append('answer', formData.answer);
            data.append('status', formData.status);

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/questions`,
                data,
                { headers }
            );

            if (response?.data) {
                setFormData({ question: '', answer: '', status: '' });
                mutate();
                // disclosure.onOpenChange(false);
                toast.success('FAQ added successfully!');
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            const errorMsg =
                axiosError.response?.data && typeof axiosError.response.data === 'object'
                    ? (axiosError.response.data as any).message
                    : 'An unexpected error occurred.';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Button size='lg' onPress={disclosure.onOpen} className="bg-blue-600 text-white hover:bg-blue-700">
                <IoAddCircleOutline className="h-6 w-6" /> Add FAQ
            </Button>

            <Modal isDismissable={false} isOpen={disclosure.isOpen} onOpenChange={disclosure.onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <form onSubmit={handleAddSubmit}>
                            <ModalHeader className="text-lg font-bold uppercase">Add FAQ</ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col gap-4">
                                    <div className="col-span-3">
                                        <Input
                                            isRequired
                                            size='lg'
                                            variant='bordered'
                                            label="Question"
                                            labelPlacement='outside'
                                            id="question"
                                            type="text"
                                            name="question"
                                            placeholder="Enter question"
                                            value={formData.question}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-span-1">
                                        <Select
                                            isRequired
                                            size='lg'
                                            variant='bordered'
                                            label="Status"
                                            labelPlacement='outside'
                                            placeholder="Select Status"
                                            id="status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            required
                                        >
                                            <SelectItem key="active">Active</SelectItem>
                                            <SelectItem key="in-active">In-Active</SelectItem>
                                        </Select>
                                    </div>

                                    <div className="col-span-4">
                                        <Textarea
                                            isRequired
                                            size='lg'
                                            variant='bordered'
                                            label="Answer"
                                            labelPlacement='outside'
                                            id="answer"
                                            name="answer"
                                            placeholder="Enter answer"
                                            value={formData.answer}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button size='lg' color="danger" variant="light" onPress={onClose} disabled={loading}>
                                    Cancel
                                </Button>
                                
                                <Button
                                    size='lg'
                                    color="primary"
                                    type="submit"
                                    className={loading ? 'opacity-50 pointer-events-none' : ''}
                                    disabled={loading}
                                >
                                    {loading ? <BtnLoadingSpinner /> : 'Submit'}
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default AddQuestion;
