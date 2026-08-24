"use client";
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Spinner,
  Divider,
  Chip,
} from "@heroui/react";
import { handleAcceptSchedule } from "../utils/api";
import DeclineConfirmationModal from "./declineconfirmationmodal";
import { formatDate, formatTime } from "../utils/format";
import {
  LuBuilding2,
  LuCalendarRange,
  LuMail,
  LuPhone,
  LuUser2,
} from "react-icons/lu";

type EventDetailsModalProps = {
  event: any;
  onClose: () => void;
};

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  onClose,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (event) {
      onOpen(); // Open modal when an event is passed
    }
  }, [event, onOpen]);

  const handleCloseModal = () => {
    onClose(); // Trigger parent onClose
  };

  return (
    <>
      {/* Main Modal */}
      <Modal size="lg" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onCloseModal) => (
            <div className="py-4">
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-200 p-2 rounded-lg text-blue-600">
                    <LuCalendarRange size={32} />
                  </div>
                  <div>
                    <h1 className="uppercase leading-3">{event.title}</h1>
                    <p className="text-sm text-default-500 font-normal">
                      {formatDate(event.date)} at {formatTime(event.time)}
                    </p>
                  </div>
                </div>
              </ModalHeader>
              <Divider className="my-4" />
              <ModalBody>
                <div className="space-y-4">
                  {/* Event Details */}
                  <div className="flex items-center gap-4">
                    <div className="bg-green-200 text-green-700 p-2 rounded-full">
                      <LuUser2 size={24} />
                    </div>
                    <div>
                      <span className="text-sm text-default-500 leading-3">
                        Full Name
                      </span>
                      <h1 className="font-medium capitalize">{event.name}</h1>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-green-200 text-green-700 p-2 rounded-full">
                      <LuMail size={24} />
                    </div>
                    <div>
                      <span className="text-sm text-default-500 leading-3">
                        Email
                      </span>
                      <h1 className="font-medium">{event.email}</h1>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-green-200 text-green-700 p-2 rounded-full">
                      <LuPhone size={24} />
                    </div>
                    <div>
                      <span className="text-sm text-default-500 leading-3">
                        Phone
                      </span>
                      <h1 className="font-medium">{event.phone}</h1>
                    </div>
                  </div>

                  <Divider className="my-4" />

                  <div className="flex items-center gap-4">
                    <div className="bg-green-200 text-green-700 p-2 rounded-full">
                      <LuBuilding2 size={24} />
                    </div>
                    <div>
                      <span className="text-sm text-default-500 leading-3">
                        Property
                      </span>
                      <h1 className="font-medium">{event.properties}</h1>
                    </div>
                  </div>

                  <div className="bg-gray-200 rounded-lg h-auto min-h-48 px-4 py-4">
                    {event.message || "No message provided"}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="flex justify-between gap-2">
                <Button
                  className="w-full"
                  size="lg"
                  color="primary"
                  isLoading={isLoading}
                  isDisabled={event.status === "Accepted"}
                  onPress={() => handleAcceptSchedule(event, setIsLoading)}
                >
                  {event.status === "Accepted" ? "Accepted" : "Accept Schedule"}
                </Button>
                <Button
                  className="w-full"
                  size="lg"
                  color="danger"
                  isDisabled={event.status === "Declined"}
                  onPress={() => setIsDeclineModalOpen(true)}
                >
                  {event.status === "Declined"
                    ? "Declined"
                    : "Decline Schedule"}
                </Button>
              </ModalFooter>
            </div>
          )}
        </ModalContent>
      </Modal>

      {/* Decline Confirmation Modal */}
      {isDeclineModalOpen && (
        <DeclineConfirmationModal
          event={event}
          onClose={() => setIsDeclineModalOpen(false)}
        />
      )}
    </>
  );
};

export default EventDetailsModal;
