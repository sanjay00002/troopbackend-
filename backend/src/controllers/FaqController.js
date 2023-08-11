import model from '../models';
const { Faq } = model;

export default {
    createFaq: async function (req,res){
        const faq = req.body
        await Faq.create({
            question: faq?.question,
            answer: faq?.answer
        })
        
        const faqs = await Faq.findAll();

        return res.status(200).json(faqs);
    },
    getAllFaqs: async function(req,res){
        try{
            const faqs = await Faq.findAll();
            return res.status(202).json(faqs)

        }catch(err){
            console.log(err);
            return res.status(404).send("No Faqs Found")
        }

    },
    updateFaqById : async function (req,res){
        const prevFaq = req.body
        // console.log(prevFaq.id);
        try {
            const faq = await Faq.findByPk(prevFaq.id)
            console.log(faq);

            await faq.update({
                question: prevFaq?.question ?? faq.question,
                answer: prevFaq?.answer ?? faq.answer
            })

            const updatedFaq = await Faq.findByPk(prevFaq.id)

            return res.status(200).json(updatedFaq)
        } catch (error) {
            return res.status(404).send("Faq does not exist to be updated")
        }
    },
    enterBulkFaqData: async function (req, res) {
        const faqs  = req.body;
        
        try {
          for (const faq of faqs) {
    
            const newfaq = await Faq.create({
              question: faq.question,
              answer: faq.answer,
            });
          }
    
          return res.status(201).json({
            message: 'Faqs Inserted successfully',
          });
        } catch (error) {
          console.error('Error while entering faqs data:', error);
          return res.status(500).json({
            errorMessage: error.message,
            error: 'Something went wrong while entering faq data!',
          });
        }
      },
  }
