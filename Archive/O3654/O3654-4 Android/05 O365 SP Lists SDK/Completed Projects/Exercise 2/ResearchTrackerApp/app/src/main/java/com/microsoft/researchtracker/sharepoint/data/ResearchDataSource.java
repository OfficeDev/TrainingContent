package com.microsoft.researchtracker.sharepoint.data;

import com.microsoft.researchtracker.Constants;
import com.microsoft.researchtracker.sharepoint.models.ResearchProjectModel;
import com.microsoft.researchtracker.sharepoint.models.ResearchReferenceModel;
import com.microsoft.services.sharepoint.ListClient;
import com.microsoft.services.sharepoint.Query;
import com.microsoft.services.sharepoint.SPList;
import com.microsoft.services.sharepoint.SPListItem;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

public class ResearchDataSource {

    private final ListClient mClient;

    public ResearchDataSource(ListClient client) {
        mClient = client;
    }
    
    public List<ResearchProjectModel> getResearchProjects() throws ExecutionException, InterruptedException  {

        Query query = new Query().select(ResearchProjectModel.SELECT)
                .expand(ResearchProjectModel.EXPAND);
        List<SPListItem> items = mClient.getListItems(Constants.RESEARCH_PROJECTS_LIST, query).get();
        List<ResearchProjectModel> models = new ArrayList<ResearchProjectModel>();
        for (SPListItem item : items) {
            models.add(new ResearchProjectModel(item));
        }
        return models;
    }

    public ResearchProjectModel getResearchProjectById(int projectId) throws ExecutionException, InterruptedException {

        Query query = new Query().select(ResearchProjectModel.SELECT)
                .expand(ResearchProjectModel.EXPAND);

        query.field("Id").eq().val(projectId);

        List<SPListItem> items = mClient.getListItems(Constants.RESEARCH_PROJECTS_LIST, query).get();

        if (items.size() == 0) {
            return null;
        }

        return new ResearchProjectModel(items.get(0));
    }

    public List<ResearchReferenceModel> getResearchReferencesByProjectId(int projectId) throws ExecutionException, InterruptedException {

        Query query = new Query().select(ResearchReferenceModel.SELECT)
                .expand(ResearchReferenceModel.EXPAND);

        query.field("Project").eq().val(projectId);

        List<SPListItem> items = mClient.getListItems(Constants.RESEARCH_REFERENCES_LIST, query).get();

        List<ResearchReferenceModel> models = new ArrayList<ResearchReferenceModel>();
        for (SPListItem item : items) {
            models.add(new ResearchReferenceModel(item));
        }
        return models;
    }

    public ResearchReferenceModel getResearchReferenceById(int referenceId) throws ExecutionException, InterruptedException {

        Query query = new Query().select(ResearchReferenceModel.SELECT)
                .expand(ResearchReferenceModel.EXPAND);

        query.field("Id").eq().val(referenceId);

        List<SPListItem> results = mClient.getListItems(Constants.RESEARCH_REFERENCES_LIST, query).get();

        if (results.size() == 0) {
            return null;
        }

        return new ResearchReferenceModel(results.get(0));
    }

    public void deleteResearchProject(int projectId) throws ExecutionException, InterruptedException {

        SPListItem item = new SPListItem();
        item.setData("Id", projectId);

        mClient.deleteListItem(item, Constants.RESEARCH_PROJECTS_LIST).get();
    }

    public void createResearchProject(ResearchProjectModel model) throws ExecutionException, InterruptedException {

        SPList list = mClient.getList(Constants.RESEARCH_PROJECTS_LIST).get();

        mClient.insertListItem(model.getData(), list);
    }

    public void updateResearchProject(ResearchProjectModel model) throws ExecutionException, InterruptedException {

        SPList list = mClient.getList(Constants.RESEARCH_PROJECTS_LIST).get();

        mClient.updateListItem(model.getData(), list);
    }

    public void deleteResearchReference(int referenceId) throws ExecutionException, InterruptedException {

        SPListItem token = new SPListItem();
        token.setData("Id", referenceId);

        mClient.deleteListItem(token, Constants.RESEARCH_REFERENCES_LIST);
    }

    public void createResearchReference(ResearchReferenceModel model) throws ExecutionException, InterruptedException {

        SPList list = mClient.getList(Constants.RESEARCH_REFERENCES_LIST).get();

        mClient.insertListItem(model.getData(), list);
    }

    public void updateResearchReference(ResearchReferenceModel model) throws ExecutionException, InterruptedException {

        SPList list = mClient.getList(Constants.RESEARCH_REFERENCES_LIST).get();

        mClient.updateListItem(model.getData(), list);
    }
}
