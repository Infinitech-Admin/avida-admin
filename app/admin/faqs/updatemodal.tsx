'use client';

import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { mutate as globalMutate } from 'swr';
import toast from 'react-hot-toast';
import BtnLoadingSpinner from '@/app/components/spinner';
import { Modal, ModalContent, Button, Input, Select, SelectItem, Textarea } from "@heroui/react";

interface UpdateQuestionProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: {
        id: string;
        question: string;
        answer: string;
        status: string;
    } | null;
    mutate: () => void;
}

const UpdateQuestion: React.FC<UpdateQuestionProps> = ({ isOpen, onClose, initialData, mutate }) => {
    const [formData, setFormData] = useState({
        id: '',
        question: '',
        answer: '',
        status: '',
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                id: initialData.id,
                question: initialData.question,
                answer: initialData.answer,
                status: initialData.status,
            });
        }
    }, [initialData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const accessToken = typeof window !== 'undefined'
                ? sessionStorage.getItem('token')
                : null;

            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            };

            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/questions`,
                formData,
                { headers }
            );

            if (response?.data) {
                mutate();
                globalMutate(`${process.env.NEXT_PUBLIC_API_URL}/api/questions`);
                toast.success('FAQ updated successfully!');
                onClose(); // Close modal
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
        <Modal size='xl' isOpen={isOpen} onOpenChange={onClose} isDismissable={!loading}>
            <ModalContent>
                {() => (
                    <form onSubmit={handleUpdateSubmit}>
                        <div className="flex justify-between items-center py-3 px-4 border-b">
                            <h3 className="text-lg font-bold text-gray-800 uppercase">Update FAQ</h3>
                        </div>
                        <div className="p-4">
                            <div className="flex flex-col gap-4">
                                <div className="col-span-3">
                                    <Input
                                        label="Question"
                                        labelPlacement='outside'
                                        size='lg'
                                        variant='bordered'
                                        id="question"
                                        name="question"
                                        type="text"
                                        value={formData.question}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-span-1">
                                    <Select
                                        label="Status"
                                        labelPlacement="outside"
                                        size="lg"
                                        variant="bordered"
                                        selectedKeys={[formData.status]}
                                        onSelectionChange={(keys) => {
                                            const selected = Array.from(keys)[0] as string;
                                            setFormData((prev) => ({ ...prev, status: selected }));
                                        }}
                                        required
                                    >
                                        <SelectItem key="active">Active</SelectItem>
                                        <SelectItem key="in-active">In-Active</SelectItem>
                                    </Select>

                                </div>

                                <div className="col-span-4">
                                    <Textarea
                                        label="Answer"
                                        labelPlacement='outside'
                                        size='lg'
                                        variant='bordered'
                                        id="answer"
                                        name="answer"
                                        value={formData.answer}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
                            <Button
                                size='lg'
                                variant='faded'
                                type="button"
                                onPress={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                size='lg'
                                isLoading={loading}
                                type="submit"
                                color='primary'
                            >
                                Save Changes
                            </Button>
                        </div>
                    </form>
                )}
            </ModalContent>
        </Modal>
    );
};

export default UpdateQuestion;
