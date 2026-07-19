import * as quotationService from "../services/quotation.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAll = async (req, res, next) => {
  try {
    const templates = await quotationService.getAllTemplates();
    return res.status(200).json(new ApiResponse(200, templates, "Quotation templates fetched successfully"));
  } catch (err) { next(err); }
};

export const getById = async (req, res, next) => {
  try {
    const template = await quotationService.getTemplateById(req.params.id);
    return res.status(200).json(new ApiResponse(200, template, "Template fetched successfully"));
  } catch (err) { next(err); }
};

export const create = async (req, res, next) => {
  try {
    const template = await quotationService.createTemplate(req.body);
    return res.status(201).json(new ApiResponse(201, template, "Quotation template created"));
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const template = await quotationService.updateTemplate(req.params.id, req.body);
    return res.status(200).json(new ApiResponse(200, template, "Quotation template updated"));
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    await quotationService.deleteTemplate(req.params.id);
    return res.status(200).json(new ApiResponse(200, null, "Quotation template deleted"));
  } catch (err) { next(err); }
};
