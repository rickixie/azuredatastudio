/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { SerializedError } from 'vs/base/common/errors';
import { Event } from 'vs/base/common/event';
import { createDecorator } from 'vs/platform/instantiation/common/instantiation';

export const IExtensionHostStarter = createDecorator<IExtensionHostStarter>('extensionHostStarter');

export const ipcExtensionHostStarterChannelName = 'extensionHostStarter';

export interface IExtensionHostProcessOptions {
	responseWindowId: number;
	responseChannel: string;
	responseNonce: string;
	env: { [key: string]: string | undefined };
	detached: boolean;
	execArgv: string[] | undefined;
	silent: boolean;
}

export interface IExtensionHostStarter {
	readonly _serviceBrand: undefined;

	onDynamicStdout(id: string): Event<string>;
	onDynamicStderr(id: string): Event<string>;
	onDynamicMessage(id: string): Event<any>;
	onDynamicError(id: string): Event<{ error: SerializedError }>;
	onDynamicExit(id: string): Event<{ code: number; signal: string }>;

	canUseUtilityProcess(): Promise<boolean>;
	createExtensionHost(useUtilityProcess: boolean): Promise<{ id: string }>;
	start(id: string, opts: IExtensionHostProcessOptions): Promise<void>;
	enableInspectPort(id: string): Promise<boolean>;
	kill(id: string): Promise<void>;

}
