import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards,    UploadedFile, UseInterceptors, Request, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags,  ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ParseIntPipe } from '@nestjs/common';


import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';


@ApiTags('product')
@Controller('product')
export class ProductController {

  constructor(private  readonly productService: ProductService) {}

  /*🏳️<===============(Create Product Start)===============>🏳️*/
  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('productImageUrl', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'T-shirt' },
        description: { type: 'string', example: 'Cotton T-shirt' },
        price: { type: 'number', example: 100 },
        stock: { type: 'number', example: 10 },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Create a new product with image' })
  @ApiResponse({ status: 201, description: 'Product created successfully.' })
  async createProduct(@UploadedFile() file: Express.Multer.File,@Body() createProductDto: CreateProductDto, @Request() req:any) {

    const imagePath = file ? `uploads/${file.filename}` : null;
    const userId = req.user.id;

   return this.productService.createProduct(userId,createProductDto,imagePath ?? undefined  );
  }
  /*🚩<===============(Create Product End)===============>🚩*/



  /*🏳️<===============(Get A Product Start)===============>🏳️ */
   @Get('getById/:id')
   @UseGuards(JwtAuthGuard)
   @ApiBearerAuth()
   @ApiOperation({ summary: 'Get all products' })
   @ApiResponse({ status: 200, description: 'Products retrieved successfully.' })
   @ApiResponse({ status: 401, description: 'Unauthorized.' })
   @ApiResponse({ status: 404, description: 'Not Found.' })
    async getProductById(@Param('id') id: number,@Request() req: any) {
    const userId = req.user.id;
    console.log(userId)
         return this.productService.getProductById(id,userId);
   }
  /*🚩<===============(Get A Product End)===============>🚩*/



  /*🏳️<===============(Get All Product Start)===============>🏳️ */
  @Get('getAll')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getAllProducts(@Request() req: any) {
      const userId = req.user.id;
      console.log(userId)
      return this.productService.getAllProduct(userId);
  }
  /*🚩<===============(Get All Product End)===============>🚩*/



  /*🏳️<===============(Update A Product Start)===============>🏳️ */
  @Put('update/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Updated T-shirt' },
        description: { type: 'string', example: 'Updated Cotton T-shirt' },
        price: { type: 'number', example: 120 },
        stock: { type: 'number', example: 5 },
        image: {
          type: 'string',
          format: 'binary',      
        },
      },
    },
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product with optional image' })
  @ApiResponse({ status: 200, description: 'Product updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async updateProduct(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() UpdateProductDto: UpdateProductDto,
    @Request() req: any
  ) {
    const imagePath = file ? `uploads/${file.filename}` : undefined;
    const userId = req.user.id;
    return this.productService.updateProduct(id, UpdateProductDto,userId, imagePath);
  }
    /*🚩<===============(Update A Product End)===============>🚩*/


    /*🏳️<===============(Delete A Product Start)===============>🏳️ */
    @Delete('delete/:id')
    @UseGuards(JwtAuthGuard)  
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a product' })
    @ApiResponse({ status: 200, description: 'Product deleted successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Not Found.' })
    async deleteProduct(@Param('id') id: number, @Request() req: any) {
        const userId = req.user.id;
        return this.productService.deleteProduct(id, userId);
    }
  /*🚩<===============(Delete A Product End)===============>🚩*/



}


