import Modal from './Modal';
import { useEffect, useState } from 'react';

interface Props {
    onCreate: (name: string) => void | Promise<void>
}

export const useNewListModal = (props: Props): [JSX.Element | null, (show?: boolean) => void] => {
    const [listName, setListName] = useState('');

    const dialog = <Modal onCancel={() => setModal(null)} onOk={() => props.onCreate(listName)} okText='Create' noText='Cancel'>
        <div className='column'>
            <div>
                Enter list name:
            </div>
            <div>
                <input type="text" value={listName} onChange={e => setListName(e.target.value)} />
            </div>
        </div>
    </Modal>

    const [modal, setModal] = useState<JSX.Element | null>(null);

    useEffect(() => {
        if (modal)
            setModal(dialog);
    }, [listName]);

    useEffect(() => {
        if (!modal)
            setListName('')
    }, [modal]);


    const showModal = (show?: boolean) => {
        setModal((show ?? true) ? dialog : null);
    };

    return [modal, showModal];
};
