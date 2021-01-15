/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { Container } from 'inversify';
import { CoreProcessManager } from './core-process-manager';
import { expect } from 'chai';

/** PPID, PID */
const mockPsOutput = `\
     5     6
    40     7
     1     2
     1     3
     2    40
     2     5
     0     1
`;

describe('CoreProcessManager', () => {

    let coreProcessManager: CoreProcessManager;

    beforeEach(() => {
        const container = new Container();
        container.bind(CoreProcessManager).toSelf().inSingletonScope();
        coreProcessManager = container.get(CoreProcessManager);
    });

    it('CoreProcessManager#unix_getChildrenRecursive', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        coreProcessManager['spawnSync'] = () => ({ stdout: mockPsOutput }) as any;
        const pids = coreProcessManager['unix_getChildrenRecursive'](2);
        expect(Array.from(pids)).members([40, 5, 6, 7]);
    });
});
