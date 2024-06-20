import { CategoryModel } from "../model/categoriesModel.js";

//cretae a categoriess
export const createcategories = async (req, res) => {
  try {
    const { category, status } = req.body;

    if (!category || !status) {
      return res.status(409).send({
        success: false,
        message: "Provide All fields",
      });
    }

    const is_inserted = await CategoryModel.create({
      category: category,
      status: status,
    });

    if (is_inserted) {
      return res.status(201).send({
        success: true,
        message: "The Categories Created Succesfully",
      });
    }
  } catch (error) {
    return res.status(504).send({
      success: false,
      message: "The error in create categories api ",
      error: error,
    });
  }
};

//get all categories
export const getallcategories = async (req, res) => {
  try {
    const category = await CategoryModel.find({});
    let FilteredCategories = category;

    const { search, status , page=1 , limit=2 } = req.query;

    //searching
    if (search) {
      let regex = RegExp(search, "i");
      FilteredCategories = category.filter((item) => regex.test(item.category));
    }

    //filtering
    if (status) {
      FilteredCategories = category.filter(
        (item) => item.status === parseInt(status)
      );
    }

    //pagination
    const StartIndex = (page - 1) * limit;
    const  EndIndex = StartIndex + parseInt(limit);
    const Paginateddata = FilteredCategories.slice(StartIndex, EndIndex);

    res.json({
      TotalFiltered: FilteredCategories.length,
      totalPages: Math.ceil(FilteredCategories.length / limit),
      currentPage: parseInt(page),
      results: Paginateddata,
    });

  } catch (error) {
    console.log(error)
    return res.status(504).send({
      success: false,
      message: "The Error in get categories api",
      error: error,
    });
  }
};

//get category by id
export const getsinglecategory =  async (req,res)=>{
    try{

      const category = await CategoryModel.findById(req.params.id);

      if(!category){
        return res.status(404).send({
          success : false ,
          message : "The category is not found"
        })
      }

      res.status(200).send({
        success : true,
        message : "The Category Find Succesfully",
        category : category
      })

    }catch(error){
      if (error.name === "CastError") {
        return res.status(500).send({
          success: false,
          message: "Invalid Category ID",
        });
      }
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Error in Categories get API",
        error,
      });
    }
  }


  //update categories

export const updatecategories = async (req,res)=>{
    try{

      const id = req.params.id;

      const {category , status  } = req.body;
      const categories = await CategoryModel.findById(id)

      if(!categories){
        return res.status(404).send({
          success : false,
          message : "The Category is not found"
        })
      }

      const is_updated = await CategoryModel.findByIdAndUpdate(id , {
           category : category,
           status : status
      })
      if(is_updated){
        return res.status(200).send({
          success : true ,
          message : "The Categories Updated Succcesfully"
        })
      }


    }catch(error){
      if (error.name === "CastError") {
        return res.status(500).send({
          success: false,
          message: "Invalid Category ID",
        });
      }
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Error in Categories Update API",
        error,
      });
    }
  }

//delete categories

export const deletecategory = async (req, res)=>{
  try{

    const id = req.params.id;
    const category = await CategoryModel.findById(id);

    if(!category){
      return res.status(404).send({
        success : false,
        message : "The Category is not found "
      })
    }

    const is_Deleted = await CategoryModel.findByIdAndDelete(id);

    if(is_Deleted){
      return res.status(200).send({
        success : true,
        message : "The Categories Deleted Succesfully"
      })
    }
  }catch(error){
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Category ID",
      });
    }
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Categories Update API",
      error,
    });
  }
}