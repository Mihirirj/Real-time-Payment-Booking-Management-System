import Park from "../models/Park.js"
import Slot from "../models/Slot.js"
import mongoose from "mongoose";
export const createPark =async(req,res,next)=>{
    const newPark = new Park(req.body)

    try {
      const savedPark = await newPark.save()
      res.status(200).json(savedPark)
    } catch (err) {
     next(err);
    }
}

export const updatePark =async(req,res,next)=>{
    try {
        const updatedPark = await Park.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true }
        );
        res.status(200).json(updatedPark);
    } catch (err) {
     next(err);
    }
}

export const deletePark =async(req,res,next)=>{
    try {
        await Park.findByIdAndDelete(
           req.params.id,
    
         );
         res.status(200).json("Park has been deleted");
       } catch (err) {
     next(err);
    }
}

export const getPark =async(req,res,next)=>{
    try {
        const park = await Park.findById(
          req.params.id
        );
        res.status(200).json(park);
      } catch (err) {
     next(err);
    }
}

export const getallPark = async (req, res, next) => {
    const { min, max, limit, ...others } = req.query; 
    try {
        const parks = await Park.find({
            ...others,
            cheapestPrice: { $gt: min || 1, $lt: max || 999 }, // Use || to provide default values if min/max are not provided
        }).limit(parseInt(limit) || 0); 
        res.status(200).json(parks);
    } catch (err) {
        next(err);
    }
};


export const countByProvince = async (req, res, next) => {
  const cities = req.query.cities.split(",");

  try {
      const list = await Promise.all(
          cities.map(city => {
              return Park.countDocuments({ city: city });
          })
      );
      res.status(200).json(list);
  } catch (err) {
      next(err);
  }
};

export const countByType = async (req, res, next) => {
  try{
  
  const privatecarparkCount =await Park.countDocuments({type:"privatecarpark"});
  const  publiccarparkCount=await Park.countDocuments({type:"publiccarpark"});
  const  commercialcarparkCount=await Park.countDocuments({type:"commercialcarpark"});
  const  residentialcarparkCount=await Park.countDocuments({type:"residentialcarpark"});
  const parkandridecarparkCount=await Park.countDocuments({type:"parkandridecarpark"})

      res.status(200).json([
          
          {type:"private carpark",count:privatecarparkCount},
          {type:"public carpark",count:publiccarparkCount},
          {type:"commercial carpark",count:commercialcarparkCount},
          {type:"residential carpark",count:residentialcarparkCount},
          {type:"Park and Ride ",count:parkandridecarparkCount},
      ]);
  } catch (err) {
      next(err);
  }
};

export const getParksByProvince = async (req, res, next) => {
  const { cities } = req.query;

  if (!cities) {
      return res.status(400).json({ message: "Cities query parameter is required" });
  }

  const cityList = cities.split(",");

  try {
      const parksByProvince = await Promise.all(
          cityList.map(async (city) => {
              const parks = await Park.find({ city: city });
              return {
                  province: city,
                  parks: parks,
              };
          })
      );
      res.status(200).json(parksByProvince);
  } catch (err) {
      next(err);
  }
};

export const getParkSlots = async (req, res, next) => {
    try {
        const park = await Park.findById(req.params.id);
        const slotIds = park.slots.map(slot => {
            if (mongoose.Types.ObjectId.isValid(slot)) {
                return new mongoose.Types.ObjectId(slot);
            } else {
                
                return null;
            }
        }).filter(id => id !== null); 
        const slots = await Slot.find({ _id: { $in: slotIds } });
        res.status(200).json(slots);
    } catch (err) {
        next(err);
    }
};

