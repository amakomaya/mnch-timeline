import React from 'react';
import './Plugin.module.css';
import './tailwind.css';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EnrollmentOverviewProps } from './Plugin.types';

import ImmunizationSchedule from "./ImmunizationSchedule";


const queryClient = new QueryClient();

const PluginInner = (propsFromParent: EnrollmentOverviewProps) => {

    const {
        teiId,
        programId,
        orgUnitId,
    } = propsFromParent;

    return (
        <QueryClientProvider client={queryClient}>
            <div className='bg-white w-screen flex m-0 p-0'>
                <ImmunizationSchedule teiId={teiId} programId={programId} orgUnitId={orgUnitId} />
            </div>
        </QueryClientProvider>
    );
};

export default PluginInner;
