"use client";
import React, { useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Spinner,
} from "@heroui/react";
import { handleDeclineSchedule } from "../utils/api";

type DeclineConfirmationModalProps = {
    event: any;
    onClose: () => void;
};

const DeclineConfirmationModal: React.FC<DeclineConfirmationModalProps> = ({
    event,
    onClose,
}) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure({ defaultOpen: true });
    const [isDeclineLoading, setIsDeclineLoading] = useState(false);

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onCloseModal) => (
                    <>
                        {/* Modal Header */}
                        <ModalHeader className="flex flex-col gap-1">
                            Confirm Decline
                        </ModalHeader>

                        {/* Modal Body */}
                        <ModalBody>
                            <p>
                                Are you sure you want to decline this schedule?
                            </p>
                        </ModalBody>

                        {/* Modal Footer */}
                        <ModalFooter className="flex justify-between gap-2">
                            <Button
                                variant="light"
                                onPress={() => {
                                    onCloseModal(); // Close modal
                                    onClose(); // Trigger parent onClose
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="danger"
                                isDisabled={isDeclineLoading}
                                onPress={() =>
                                    handleDeclineSchedule(event, setIsDeclineLoading)
                                }
                            >
                                {isDeclineLoading ? <Spinner size="sm" /> : "Decline"}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default DeclineConfirmationModal;
