import { Dialog, Transition } from '@headlessui/react';
import { ReactNode } from 'react';
import { Fragment, useState } from 'react';

type Props = {
	heading: string;
	isOpen: boolean;
	closeModal: () => void;
	children: ReactNode;
};

const ModalDialog = ({ heading, isOpen, closeModal, children }: Props) => {
	return (
		<>
			<Transition appear show={isOpen} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={() => closeModal()}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black/25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-slate-700 p-6 text-left align-middle shadow-xl transition-all">
									<Dialog.Title
										as="h3"
										className="text-xl font-medium leading-6 text-gray-300"
									>
										{heading}
									</Dialog.Title>
									<div className="mt-2">{children}</div>

									<div className="mt-4 flex flex-row-reverse">
										<button
											type="button"
											className="btn btn-primary"
											onClick={() => closeModal()}
										>
											Submit
										</button>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
};

export default ModalDialog;
