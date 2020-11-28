import React from 'react';
import {EarnSys} from './../App';
import './Earn.css';

const Earn: React.FC<EarnSys> = ({
    mark,
    divider,
    income,
    current
}) => (
    <div className="earn-list">
        {income.map((value, id) => (
            <div
                key={id}
                className={`earn-item ${current-1 > id ? 'past' : current-1 === id ? 'active' : ''}`}
            >
                {mark + value.toLocaleString('ru').replaceAll(' ', divider)}
            </div>
        )).reverse()}        
    </div>
);
export default Earn;