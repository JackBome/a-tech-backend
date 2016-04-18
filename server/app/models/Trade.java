package models;

import models.enums.TradeState;
import models.enums.TradeType;
import play.data.validation.Constraints;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;

/**
 * Created by lzadmin on 2016/4/12 0012.
 * trade表实体类
 */
@Entity
public class Trade extends BaseModel {

    /**
     * 交易标题
     */
    @Column(length = 45, nullable = false)
    @Constraints.MaxLength(45)
    @Constraints.Required
    public String title;
    /**
     * 交易描述
     */
    @Column(length = 255, nullable = false)
    @Constraints.MaxLength(255)
    @Constraints.Required
    public String description;
    /**
     * 所属用户
     */
    @ManyToOne
    public User user;
    /**
     * 点击数
     */
    public Long clickCount;
    /**
     * 收藏数
     */
    public Long likeCount;
    /**
     * 结束时间
     */
    public Timestamp endTime;
    /**
     * 交易类型 供应/需求
     */
    @Enumerated(EnumType.STRING)
    public TradeType tradeType;
    /**
     * 所属分类
     */
    @ManyToOne
    public Category category;
    /**
     * 交易状态
     */
    @Enumerated(EnumType.STRING)
    public TradeState tradeState;

    public static final Finder<Long, Trade> find = new Finder<Long, Trade>(
            Long.class, Trade.class);
    /**
     * 查找分类下的所有交易
     * @param category
     * @return
     */
    public static List<Trade> findTradesByCategoryAndStatus(final Category category, String state) {
        return find
                .where()
                .eq("category", category)
                .eq("tradeState", state)
                .findList();
    }
}