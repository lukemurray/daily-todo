import Modal from './Modal';
import { useEffect, useState } from 'react';

interface Props {
    onCreate: (name: string) => void | Promise<void>
}

export const useNewSectionModal = (props: Props): [JSX.Element | null, (show?: boolean) => void] => {
    const [sectionName, setSectionName] = useState('');

    const dialog = <Modal onCancel={() => setModal(null)} onOk={() => props.onCreate(sectionName)} okText='Create' noText='Cancel'>
        <div className='column'>
            <div>
                Enter section name:
            </div>
            <div>
                <input type="text" value={sectionName} onChange={e => setSectionName(e.target.value)} />
            </div>
        </div>
    </Modal>

    const [modal, setModal] = useState<JSX.Element | null>(null);

    useEffect(() => {
        if (modal)
            setModal(dialog);
    }, [sectionName]);

    useEffect(() => {
        if (!modal)
            setSectionName('')
    }, [modal]);


    const showModal = (show?: boolean) => {
        setModal((show ?? true) ? dialog : null);
    };

    return [modal, showModal];
};
