/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Uri } from 'vscode';

export interface GitUriParams {
	path: string;
	ref: string;
	submoduleOf?: string;
}

export function isGitUri(uri: Uri): boolean {
	return /^git$/.test(uri.scheme);
}

export function fromGitUri(uri: Uri): GitUriParams {
	return JSON.parse(uri.query);
}

export interface GitUriOptions {
	replaceFileExtension?: boolean;
	submoduleOf?: string;
}

// As a mitigation for extensions like ESLint showing warnings and errors
// for git URIs, let's change the file extension of these uris to .git,
// when `replaceFileExtension` is true.
export function toGitUri(uri: Uri, ref: string, options: GitUriOptions = {}): Uri {
	const params: GitUriParams = {
		path: uri.fsPath,
		ref
	};

	if (options.submoduleOf) {
		params.submoduleOf = options.submoduleOf;
	}

	let path = uri.path;

	if (options.replaceFileExtension) {
		path = `${path}.git`;
	} else if (options.submoduleOf) {
		path = `${path}.diff`;
	}

	return uri.with({
		scheme: 'git',
		path,
		query: JSON.stringify(params)
	});
}

/**
 * Assuming `uri` is being merged it creates uris for `base`, `ours`, and `theirs`
 */
export function toMergeUris(uri: Uri): { base: Uri; ours: Uri; theirs: Uri } {
	return {
		base: toGitUri(uri, ':1'),
		ours: toGitUri(uri, ':2'),
		theirs: toGitUri(uri, ':3'),
	};
}
