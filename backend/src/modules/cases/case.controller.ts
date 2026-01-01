import { inject, injectable } from 'inversify';

import { TYPES } from '@/types/identifiers';
import {
  AssignCaseBodyDto,
  AssignCaseParamsDto,
  CreateCaseRequestDto,
} from '@/modules/cases/schemas/case.request.schema';
import {
  CaseListResponseDto,
  CaseResponseDto,
} from '@/modules/cases/schemas/case.response.schema';
import { handleRequest } from '@/common/http/handler';
import { CaseService } from '@/modules/cases/case.service';

@injectable()
export class CaseController {
  constructor(
    @inject(TYPES.CaseService)
    private readonly service: CaseService,
  ) {}

  createCase = handleRequest<CreateCaseRequestDto>(async (req) => {
    await this.service.create(req.body);
    return { status: 201 };
  });

  assignCase = handleRequest<
    AssignCaseBodyDto,
    CaseResponseDto,
    unknown,
    AssignCaseParamsDto
  >(async (req) => {
    const result = await this.service.assign(req.params.id, req.body.userId);

    return {
      ...result,
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    };
  });

  listCases = handleRequest<unknown, CaseListResponseDto>(async () => {
    const cases = await this.service.list();
    return cases.map(
      (c): CaseResponseDto => ({
        id: c.id,
        title: c.title,
        status: 'OPEN',
        description: c.description,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
        assignedUserId: c.assignedUserId ?? null,
      }),
    );
  });
}
