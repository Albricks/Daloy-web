import { ModulePreviewStandard } from './module-preview-standard.model';

export interface ModulePreviewDto {
id: string;
title: string;
description: string;
order: string;
level: string;
duration: string;
lessons: number;
status: string;
objectives: string[];
previewStandard?: ModulePreviewStandard;
}