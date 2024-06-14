import { Controller, Get, Post, Body, Put, Param, Query, Delete, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiConsumes, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { RequirePermission } from 'src/common/decorators/require-premission.decorator';
import { RequireRole } from 'src/common/decorators/require-role.decorator';

import { CreateUserDto, UpdateUserDto, ListUserDto, ChangeStatusDto, ResetPwdDto } from './dto/index';

@ApiTags('用户管理')
@Controller('system/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '用户-创建',
  })
  @ApiBody({
    type: CreateUserDto,
    required: true,
  })
  @RequirePermission('system:user:add')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({
    summary: '用户-列表',
  })
  @RequirePermission('system:user:query')
  @Get('list')
  findAll(@Query() query: ListUserDto, @Request() req) {
    const user = req.user.user;
    return this.userService.findAll(query, user);
  }

  @ApiOperation({
    summary: '用户-部门树',
  })
  @RequirePermission('system:dept:query')
  @Get('deptTree')
  deptTree() {
    return this.userService.deptTree();
  }

  @ApiOperation({
    summary: '用户-角色+岗位',
  })
  @RequirePermission('system:user:add')
  @Get()
  findPostAndRoleAll() {
    return this.userService.findPostAndRoleAll();
  }

  @ApiOperation({
    summary: '用户-分配角色-详情',
  })
  @RequireRole('admin')
  @Get('authRole/:id')
  authRole(@Param('id') id: string) {
    return this.userService.authRole(+id);
  }

  @ApiOperation({
    summary: '用户-角色信息-更新',
  })
  @RequireRole('admin')
  @Put('authRole')
  updateAuthRole(@Query() query) {
    return this.userService.updateAuthRole(query);
  }

  @ApiOperation({
    summary: '用户-详情',
  })
  @RequirePermission('system:user:query')
  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.userService.findOne(+userId);
  }

  @ApiOperation({
    summary: '用户-停用角色',
  })
  @ApiBody({
    type: ChangeStatusDto,
    required: true,
  })
  @RequireRole('admin')
  @Put('changeStatus')
  changeStatus(@Body() changeStatusDto: ChangeStatusDto) {
    return this.userService.changeStatus(changeStatusDto);
  }

  @ApiOperation({
    summary: '用户-更新',
  })
  @ApiBody({
    type: UpdateUserDto,
    required: true,
  })
  @RequirePermission('system:user:edit')
  @Put()
  update(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    const userId = req.user.userId;
    return this.userService.update(updateUserDto, userId);
  }

  @ApiOperation({
    summary: '用户-重置密码',
  })
  @ApiBody({
    type: ResetPwdDto,
    required: true,
  })
  @RequireRole('admin')
  @Put('resetPwd')
  resetPwd(@Body() body: ResetPwdDto) {
    return this.userService.resetPwd(body);
  }

  @ApiOperation({
    summary: '用户-删除',
  })
  @RequireRole('admin')
  @Delete(':id')
  remove(@Param('id') ids: string) {
    const menuIds = ids.split(',').map((id) => +id);
    return this.userService.remove(menuIds);
  }
}
