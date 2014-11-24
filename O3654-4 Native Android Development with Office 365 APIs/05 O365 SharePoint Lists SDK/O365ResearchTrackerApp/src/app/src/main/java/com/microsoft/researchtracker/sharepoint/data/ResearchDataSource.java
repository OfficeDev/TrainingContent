package com.microsoft.researchtracker.sharepoint.data;

import com.microsoft.researchtracker.sharepoint.models.ResearchProjectModel;
import com.microsoft.researchtracker.sharepoint.models.ResearchReferenceModel;

import java.util.List;
import java.util.concurrent.ExecutionException;

public class ResearchDataSource {

    public ResearchDataSource() {

    }
    
    public List<ResearchProjectModel> getResearchProjects() throws ExecutionException, InterruptedException  {

        throw new RuntimeException("Not Implemented");
    }

    public ResearchProjectModel getResearchProjectById(int projectId) throws ExecutionException, InterruptedException {

        throw new RuntimeException("Not Implemented");
    }

    public List<ResearchReferenceModel> getResearchReferencesByProjectId(int projectId) throws ExecutionException, InterruptedException {

        throw new RuntimeException("Not Implemented");
    }

    public ResearchReferenceModel getResearchReferenceById(int referenceId) throws ExecutionException, InterruptedException {

        throw new RuntimeException("Not Implemented");
    }

    public void deleteResearchProject(int projectId) throws ExecutionException, InterruptedException {

        throw new RuntimeException("Not Implemented");
    }

    public void createResearchProject(ResearchProjectModel model) throws ExecutionException, InterruptedException {

        throw new RuntimeException("Not Implemented");
    }

    public void updateResearchProject(ResearchProjectModel model) throws ExecutionException, InterruptedException {

        throw new RuntimeException("Not Implemented");
    }

    public void deleteResearchReference(int referenceId) throws ExecutionException, InterruptedException {

        throw new RuntimeException("Not Implemented");
    }

    public void createResearchReference(ResearchReferenceModel model) throws ExecutionException, InterruptedException {

        throw new RuntimeException("Not Implemented");
    }

    public void updateResearchReference(ResearchReferenceModel model) throws ExecutionException, InterruptedException {

        throw new RuntimeException("Not Implemented");
    }
}
