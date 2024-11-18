import React from 'react';
import './Plugin.module.css';
import './tailwind.css';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EnrollmentOverviewProps } from './Plugin.types';

import AncTimeline from "./AncTimeline";


const queryClient = new QueryClient();

const PluginInner = (propsFromParent: EnrollmentOverviewProps) => {

    const {
        teiId,
        programId,
        orgUnitId, 
        enrollmentId
    } = propsFromParent;

    return (
        <QueryClientProvider client={queryClient}>
            <div className='bg-white w-screen flex m-0 p-0'>
                <AncTimeline teiId={teiId} programId={programId} orgUnitId={orgUnitId} enrollmentId={enrollmentId} />
            </div>
        </QueryClientProvider>
    );
};

export default PluginInner;
