import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const ShowData = () => {
    const [docs, setDocs] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
            const snapshotDocs = [];
            snapshot.forEach(doc => snapshotDocs.push(doc));
            setDocs(snapshotDocs);
        })
        return () => unsubscribe();
    }, []);

    const items = docs.map(doc => {
        console.log(doc._document.data.value.mapValue.fields.item.stringValue);
    });

    console.log("this is docs--", docs);
    return (
            <div>
                {`${[...docs]}`}
            </div>
        )
};

export default ShowData;